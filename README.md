# Project Harvey

**Project Harvey** is an advanced AI and ML-powered legal adviser designed to assist advocates, law students, and individuals seeking legal advice. Leveraging the Indian Constitution and other relevant legal frameworks, Harvey aims to provide case studies, legal remedies, judicial advice, and law-based insights. 

---

## 🚀 Features

### For Advocates:
- **Case Law Processing**: Analyze case files and retrieve relevant case laws.
- **Database Integration**: Access databases like Supreme Court Cases Online, Manupatra, and Nexus for real-time information.
- **Judicial Advice**: Generate advice based on historical case analysis.

### For Law Students:
- **Acts & Remedies**: Detailed segregation of acts and laws based on various legal scenarios (e.g., Motor Vehicle Act, CPC).
- **Case Study Assistance**: Guidance for understanding and analyzing case laws.

### For Laymen:
- **Legal Remedies**: Simplified explanations and guidance for civil laws.
- **Quick Advice**: Answers to legal queries based on input data.

---

## 🔧 Core Technologies
- **Programming Languages**: Python
- **Machine Learning Frameworks**: Scikit-learn, TensorFlow
- **Web Scraping**: BeautifulSoup, Scrapy for real-time updates
- **Databases**: SQLite3, PostgreSQL
- **Cloud Platforms**: IBM Cloud, AWS, Azure for scalability

---

## 📂 Project Structure

```plaintext
Project_Harvey/
├── data/                     # Legal data (case laws, acts, etc.)
├── models/                   # ML models for case predictions
├── scripts/                  # Automation scripts for web scraping and processing
├── src/                      # Core application code
│   ├── advocate_features/    # Features for advocates
│   ├── student_features/     # Features for law students
│   ├── laymen_features/      # Features for laymen
├── tests/                    # Unit tests
├── docs/                     # Documentation and guides
└── README.md                 # Project documentation
```

---

## 💻 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Bhargav-CS/Project_Harvey.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Project_Harvey
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up the database:
   ```bash
   python manage.py migrate
   ```

---

## 🛠️ Usage

1. Start the application:
   ```bash
   python manage.py runserver
   ```
2. Access the web interface:
   Open your browser and navigate to `http://127.0.0.1:8000`.

---

## 📝 Contributing

We welcome contributions! To get started:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add YourFeature"
   ```
4. Push the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## 🙌 Acknowledgments

- **Databases Used**: Supreme Court Cases Online, Manupatra, Nexus
- **Inspirations**: Indian Constitution and Judiciary

---

## 🛠️ Future Enhancements

- **Natural Language Processing** for document comprehension.
- **Scalable Cloud Solutions** for increased user capacity.
- **Mobile Application Integration** for on-the-go legal advice.

---


# checking if stil worthy