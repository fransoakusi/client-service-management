from app import bcrypt

class User:
    @staticmethod
    def create_user(mongo, email, password, role):
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        mongo.db.users.insert_one({"email": email, "password": hashed_password, "role": role})

    @staticmethod
    def get_user_by_email(mongo, email):
        return mongo.db.users.find_one({"email": email})
