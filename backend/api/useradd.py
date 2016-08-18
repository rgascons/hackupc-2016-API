import cmd
from sqlite3 import connect
import hashlib
import json

conn = connect('tmp/test.db')
c = conn.cursor()

class UserManager(cmd.Cmd):
    prompt = "> "
    intro = "User Manager for HackUPC API v1"

    def do_add(self, username):
        """add [username]: Adds a new user"""
        c.execute('SELECT * FROM judges WHERE name=?', (username,))
        user = c.fetchone()

        print user

        if user is not None:
            print "User already exists"
        else:
            print "User {}".format(username)

            email = raw_input('Enter email for account: ')
            password = raw_input('Enter password: ')
            password_r = raw_input('Once more: ')

            while password != password_r:
                print "Passwords don't match"
                password = raw_input('Enter password: ')
                password_r = raw_input('Once more: ')

            password_enc = hashlib.sha512(password).hexdigest()

            c.execute("INSERT INTO judges (name, email, password) VALUES (?, ?, ?)", (username, email, password_enc))
            conn.commit()

            f = open('users', 'r+')
            user_list = json.load(f)
            f.seek(0)
            f.truncate()
            user_list['users'].append({"name": username, "email": email, "password": password_enc})
            json.dump(user_list, f)
            f.close()


    def do_delete(self, username):
        if username:
            c.execute('DELETE FROM judges WHERE name=?', (username,))
            conn.commit()

            f = open('users', 'r+')
            user_list = json.load(f)
            f.seek(0)
            f.truncate()

            user_list = [x for x in user_list['users'] if x['name'] != username]

            json.dump(user_list, f)
            f.close()

    def do_EOF(self, *args):
        return True

    def do_exit(self, *args):
        return True

if __name__ == '__main__':
    try:
        UserManager().cmdloop()
    except KeyboardInterrupt:
        print "Goodbye!"