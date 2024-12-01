import os
import requests
import json

# Define the base URL and headers (if authentication is needed)
BASE_URL = "https://indiankanoon.org/doc/"
OUTPUT_FOLDER = "downloaded_pdfs"  # Directory to save PDFs
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
}

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
    return "".join(c if c.isalnum() or c in (' ', '_', '-') else '_' for c in filename)

def download_pdf(doc_id, title, base_url, output_folder, headers):
    """Download a PDF document by its ID and save it with a title and ID."""
    pdf_url = f"{base_url}{doc_id}/"
    payload = {"type": "pdf"}  # Data to submit in POST request
    print(f"Downloading from: {pdf_url}")

    try:
        # Submit POST request to download PDF
        response = requests.post(pdf_url, data=payload, headers=headers)

        # Check if the request was successful
        if response.status_code == 200:
            # Sanitize the title for use in a filename
            sanitized_title = sanitize_filename(title)
            # Save PDF to output folder with title and doc ID
            pdf_path = os.path.join(output_folder, f"{sanitized_title}_{doc_id}.pdf")
            with open(pdf_path, "wb") as pdf_file:
                pdf_file.write(response.content)
            print(f"Downloaded: {pdf_path}")
        else:
            print(f"Failed to download document {doc_id}: {response.status_code}")
    except Exception as e:
        print(f"Error for document {doc_id}: {e}")

def main():
    """Main function to download documents."""
    ensure_output_folder_exists(OUTPUT_FOLDER)

    # Get document IDs and titles from the JSON file
    json_file = 'ikanoon_results.json'  # Replace with the path to your JSON file
    document_info = get_doc_ids(json_file)

    # Loop through each document ID and title, and download the PDF
    for doc_id, title in document_info:
        download_pdf(doc_id, title, BASE_URL, OUTPUT_FOLDER, HEADERS)

if __name__ == "__main__":
    main()