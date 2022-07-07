FROM python:3.9

COPY ./requirements.txt /app/
WORKDIR /app/
RUN pip install -r requirements.txt
COPY . /app/
RUN mkdir -p files
CMD ["flask", "run", "--host=0.0.0.0"]
