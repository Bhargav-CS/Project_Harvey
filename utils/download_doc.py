import os
import requests
import json
import time
import base64
import http.client
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()


# =============================================================================
# CONFIGURATION
# =============================================================================

# Option 1: Use Official API (Recommended - requires API token)
# Get your token from: https://api.indiankanoon.org/
API_TOKEN = os.getenv("IKANOON_API_KEY")

# API Base URL
API_BASE_URL = "api.indiankanoon.org"

# Output folder for downloaded PDFs
OUTPUT_FOLDER = "downloaded_pdfs"

# Delay between requests (seconds) to avoid rate limiting
REQUEST_DELAY = 2

# =============================================================================
# API-BASED DOWNLOAD (RECOMMENDED)
# =============================================================================

def download_via_api(doc_id, title, output_folder):
    """Download document using the official Indian Kanoon API."""
    if not API_TOKEN:
        print("ERROR: API_TOKEN is not set. Please add your API token to the script.")
        print("Get your token from: https://api.indiankanoon.org/")
        return False
    
    headers = {
        'Authorization': f'Token {API_TOKEN}',
        'Accept': 'application/json'
    }
    
    try:
        connection = http.client.HTTPSConnection(API_BASE_URL)
        
        # Try to get original document (PDF if available)
        url = f'/origdoc/{doc_id}/'
        connection.request('POST', url, headers=headers)
        response = connection.getresponse()
        result = response.read()
        
        if response.status == 200:
            data = json.loads(result)
            
            if 'errmsg' in data:
                print(f"API Error for {doc_id}: {data['errmsg']}")
                return False
            
            if 'doc' in data:
                # Decode base64 document
                doc_content = base64.b64decode(data['doc'])
                content_type = data.get('Content-Type', 'application/pdf')
                
                # Determine file extension
                if 'pdf' in content_type:
                    ext = 'pdf'
                elif 'html' in content_type:
                    ext = 'html'
                else:
                    ext = 'pdf'
                
                sanitized_title = sanitize_filename(title)
                filepath = os.path.join(output_folder, f"{sanitized_title}_{doc_id}.{ext}")
                
                with open(filepath, 'wb') as f:
                    f.write(doc_content)
                
                print(f"✓ Downloaded: {filepath}")
                return True
        else:
            print(f"API request failed for {doc_id}: HTTP {response.status}")
            return False
            
    except Exception as e:
        print(f"Error downloading {doc_id}: {e}")
        return False

# =============================================================================
# PDF DOWNLOAD WITH CSRF TOKEN (Website Scraping)
# =============================================================================

import re

def download_pdf_with_csrf(doc_id, title, output_folder):
    """Download PDF by extracting CSRF token and submitting the form."""
    base_url = f"https://indiankanoon.org/doc/{doc_id}/"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    }
    
    try:
        # Create a session to maintain cookies
        session = requests.Session()
        
        # Step 1: GET the page to obtain CSRF token and cookies
        response = session.get(base_url, headers=headers, timeout=30)
        
        if response.status_code != 200:
            print(f"✗ Failed to load page {doc_id}: HTTP {response.status_code}")
            return False
        
        # Step 2: Extract CSRF token from the form
        csrf_pattern = r'name="csrfmiddlewaretoken"\s+value="([^"]+)"'
        csrf_match = re.search(csrf_pattern, response.text)
        
        if not csrf_match:
            print(f"✗ Could not find CSRF token for {doc_id}")
            # Fallback to HTML
            return download_html_fallback(doc_id, title, output_folder)
        
        csrf_token = csrf_match.group(1)
        
        # Step 3: Prepare POST request for PDF
        post_headers = headers.copy()
        post_headers.update({
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://indiankanoon.org",
            "Referer": base_url,
        })
        
        post_data = {
            "csrfmiddlewaretoken": csrf_token,
            "type": "pdf"
        }
        
        # Step 4: POST to get the PDF (handle redirects, longer timeout for PDF generation)
        pdf_response = session.post(
            base_url, 
            headers=post_headers, 
            data=post_data, 
            timeout=120,  # Longer timeout for PDF generation
            allow_redirects=True,
            stream=True  # Stream response for large files
        )
        
        if pdf_response.status_code == 200:
            content_type = pdf_response.headers.get('Content-Type', '')
            content_disp = pdf_response.headers.get('Content-Disposition', '')
            
            # Read content
            content = pdf_response.content
            
            # Check if it's a PDF by content type, content disposition, or magic bytes
            is_pdf = (
                'pdf' in content_type.lower() or 
                'pdf' in content_disp.lower() or 
                content[:4] == b'%PDF'
            )
            
            if is_pdf:
                # It's a PDF!
                sanitized_title = sanitize_filename(title)
                filepath = os.path.join(output_folder, f"{sanitized_title}_{doc_id}.pdf")
                
                with open(filepath, 'wb') as f:
                    f.write(content)
                
                print(f"✓ Downloaded (PDF): {filepath}")
                return True
            else:
                # Not a PDF, save as HTML
                sanitized_title = sanitize_filename(title)
                filepath = os.path.join(output_folder, f"{sanitized_title}_{doc_id}.html")
                
                with open(filepath, 'wb') as f:
                    f.write(content)
                
                print(f"✓ Downloaded (HTML - PDF not available): {filepath}")
                return True
        else:
            print(f"✗ PDF request failed for {doc_id}: HTTP {pdf_response.status_code}")
            return download_html_fallback(doc_id, title, output_folder)
            
    except Exception as e:
        print(f"✗ Error for {doc_id}: {e}")
        return False

# =============================================================================
# FALLBACK: HTML SCRAPING (Use if PDF download fails)
# =============================================================================

def download_html_fallback(doc_id, title, output_folder):
    """Fallback: Download document as HTML."""
    url = f"https://indiankanoon.org/doc/{doc_id}/"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://indiankanoon.org/",
        "Connection": "keep-alive",
    }
    
    try:
        session = requests.Session()
        response = session.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            sanitized_title = sanitize_filename(title)
            filepath = os.path.join(output_folder, f"{sanitized_title}_{doc_id}.html")
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(response.text)
            
            print(f"✓ Downloaded (HTML): {filepath}")
            return True
        else:
            print(f"✗ Failed {doc_id}: HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"✗ Error for {doc_id}: {e}")
        return False

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def get_doc_ids(json_file):
    """Read document IDs and titles from a JSON file."""
    with open(json_file, 'r') as file:
        data = json.load(file)
    
    doc_info = [(doc['tid'], doc['title']) for doc in data['docs']]
    return doc_info

def ensure_output_folder_exists(folder):
    """Ensure the output folder exists."""
    os.makedirs(folder, exist_ok=True)

def sanitize_filename(filename):
    """Sanitize the filename to remove or replace invalid characters."""
    # Limit filename length
    filename = filename[:100] if len(filename) > 100 else filename
    return "".join(c if c.isalnum() or c in ('_', '-') else '_' for c in filename.replace(' ', '_'))

# =============================================================================
# MAIN
# =============================================================================

def main():
    """Main function to download documents."""
    ensure_output_folder_exists(OUTPUT_FOLDER)
    
    # Get document IDs and titles from the JSON file
    json_file = 'ikanoon_results.json'
    
    if not os.path.exists(json_file):
        print(f"ERROR: {json_file} not found!")
        return
    
    document_info = get_doc_ids(json_file)
    total = len(document_info)
    success_count = 0
    
    print(f"\n{'='*60}")
    print(f"Indian Kanoon Document Downloader")
    print(f"{'='*60}")
    print(f"Total documents to download: {total}")
    print(f"Output folder: {OUTPUT_FOLDER}")
    print(f"Using API: {'Yes' if API_TOKEN else 'No (PDF with CSRF)'}")
    print(f"{'='*60}\n")
    
    for i, (doc_id, title) in enumerate(document_info, 1):
        print(f"[{i}/{total}] Processing: {title[:50]}...")
        
        # Try PDF download with CSRF token first (works for most documents)
        success = download_pdf_with_csrf(doc_id, title, OUTPUT_FOLDER)
        
        if success:
            success_count += 1
        
        # Add delay to avoid rate limiting
        if i < total:
            time.sleep(REQUEST_DELAY)
    
    print(f"\n{'='*60}")
    print(f"Download Complete: {success_count}/{total} documents")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()