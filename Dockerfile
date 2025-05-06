FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Assurons-nous que tous les fichiers ont les bonnes permissions
RUN chmod -R 755 /app

# Exécuter explicitement en tant que root
USER root

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]