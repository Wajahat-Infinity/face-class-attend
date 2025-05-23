
# Smart Attendance System with Face Recognition

A Django-based attendance system that uses face recognition to automate student attendance tracking.

## Features

- Face recognition for automatic attendance marking
- Student registration with photo capture
- Real-time attendance tracking
- Comprehensive attendance reports
- Student management

## Installation Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- A webcam for face recognition

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd attendance-system
```

### Step 2: Create a Virtual Environment (Recommended)

```bash
# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS/Linux
python -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

Note: Installing `dlib` might require additional setup:

- For Windows, you might need Visual C++ build tools
- For Linux, you need to install build-essential and cmake
- For macOS, you need Xcode command-line tools

### Step 4: Database Setup

```bash
python manage.py migrate
```

### Step 5: Create Admin User

```bash
python manage.py createsuperuser
```

### Step 6: Run the Development Server

```bash
python manage.py runserver
```

## Connecting to a Different Database

By default, the system uses SQLite. To connect to a different database (like PostgreSQL or MySQL):

1. Install the appropriate database adapter:

```bash
# For PostgreSQL
pip install psycopg2-binary

# For MySQL
pip install mysqlclient
```

2. Edit the `DATABASES` setting in `attendance_system/settings.py`:

```python
# For PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_database_name',
        'USER': 'your_database_user',
        'PASSWORD': 'your_database_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# For MySQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_database_name',
        'USER': 'your_database_user',
        'PASSWORD': 'your_database_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

3. Run migrations:

```bash
python manage.py migrate
```

## Using Face Recognition with Real Data

The system is set up to work with real face recognition data. Here's how it processes real data:

1. During student registration, a face encoding is created from the student's photo
2. The encoding is stored in the database as binary data
3. When taking attendance, the system:
   - Captures frames from the webcam
   - Detects faces in the frame
   - Compares face encodings with the stored ones
   - Identifies students and marks attendance

The confidence threshold can be adjusted in the code to make face recognition more or less strict.

## Troubleshooting

- **Face Recognition Issues**: Make sure there is good lighting when capturing photos and taking attendance
- **Database Connection Issues**: Check your database credentials and that the database server is running
- **Performance Issues**: Consider using a more powerful machine if face recognition is slow

## License

[MIT License](LICENSE)
