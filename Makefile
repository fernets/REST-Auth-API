build:
	docker build -t backend-prod .

start:
	docker run -d -p 80:80 --rm --name backend-prod backend-prod

stop:
	docker stop backend-prod