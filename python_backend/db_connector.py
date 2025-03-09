import os
from langchain_community.utilities import SQLDatabase

def get_db():
    mysql_uri = f'mysql+mysqlconnector://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}:3306/{os.getenv("DB_NAME")}'

    db = SQLDatabase.from_uri(mysql_uri)
    schema = db.get_table_info()
    return db, schema