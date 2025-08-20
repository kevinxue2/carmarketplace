from airflow import DAG
from airflow.providers.standard.operators.python import PythonOperator
from datetime import timedelta, datetime
import os
import json

import scraper
from dag_functions import clean_up, load_db

DATA_DIR = os.path.expanduser("~/carscraper/data")
dag = DAG(
    "car_marketplace_dynamic",
    start_date=datetime(2025, 1, 1),
    schedule=timedelta(days=1),
    catchup=False
)

with open(f"{DATA_DIR}/makemodel.json", "r") as f:
    make_model = json.load(f)

scrape_tasks = []
for make, models in make_model.items():
    for model in models:
        make_alpha = "".join(c if c.isalnum() else "_" for c in make)
        model_alpha = "".join(c if c.isalnum() else "_" for c in model)
        t = PythonOperator(
            task_id=f'scrape_{make_alpha.lower()}_{model_alpha.lower()}',
            python_callable=scraper.scrape_listing,
            op_args=[make, model],
            pool="scraper_pool",
            dag=dag
        )
        scrape_tasks.append(t)

load_task = PythonOperator(
    task_id="load",
    python_callable=load_db,
    dag=dag
)

clean_task = PythonOperator(
    task_id="clean_up",
    python_callable=clean_up,
    dag=dag
)

for t in scrape_tasks:
    t >> load_task
load_task >> clean_task