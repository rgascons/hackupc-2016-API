from sqlite3 import connect

conn = connect('api/tmp/test.db')
c = conn.cursor()
