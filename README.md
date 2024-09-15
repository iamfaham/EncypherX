# EncypherX

EncypherX is a robust password manager designed to securely store, manage, and share passwords. It offers features like user authentication, AES-encrypted password storage, password strength analysis, and a built-in password generator. With support for password sharing and categories or tags for easy organization, EncypherX simplifies password management while ensuring top-notch security. A Chrome extension is also included for seamless access to your passwords directly from the browser.

## Features

- **User Authentication**: Secure login and registration using bcrypt.
- **Encrypted Password Storage**: Store passwords securely with AES encryption.
- **Password Strength Analysis**: Evaluate the strength of your passwords.
- **Password Generator**: Easily generate strong, secure passwords.
- **Password Sharing**: Share passwords securely with others.
- **Categories/Tags**: Organize your passwords using categories or tags for easy management.
- **Chrome Extension**: Access and manage your passwords directly from your browser.

## Usage

1. **Register/Login**: Create an account or log in to manage your passwords.
2. **Add a Password**: Securely store passwords with AES encryption.
3. **Analyze Password Strength**: Use the password strength analyzer to check the security of your passwords.
4. **Generate a Password**: Use the password generator to create strong passwords.
5. **Share Passwords**: Securely share passwords with others using the sharing feature.
6. **Organize Passwords**: Use categories or tags to easily manage and differentiate your passwords.
7. **Use the Chrome Extension**: Install and use the Chrome extension for quick access to your stored passwords.

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Security**: AES Encryption, bcrypt for authentication
- **Extension**: Chrome Extension for easy browser access

## Run Locally

To get started with EncypherX locally, follow these steps:

### Prerequisites

- Node.js
- PostgreSQL database

### Steps

- Clone the repository:

```bash
git clone https://github.com/iamfaham/EncypherX.git
```

- Navigate to the project directory:

```bash
cd EncypherX
```

- Install dependencies:

```bash
npm install
```

- Set up the environment variables:
  Create a .env file (or .env.local) in the root directory with the `DATABASE_URL` variable.

- Run the app:

```bash
npm run dev
```

Access the app: Open your browser and navigate to `http://localhost:3000`.

## Future Enhancements

- **Chrome Extension**: Will expand the functionality of the Chrome extension with additional features like autofill and direct integration with websites for seamless password input.
- **Native Mobile App**: Develop a mobile application for Android and iOS to allow users to manage their passwords on the go.

# Hi, I'm Faham! 👋

Hey there! I'm Faham, a software developer who loves working on cool projects around AI, web development, and security. Right now, I'm interning at an AI startup based in the UK, and I’m always exploring new ways to build things that are both functional and secure.

If you want to connect or chat about tech (or anything else), hit me up on [LinkedIn](https://www.linkedin.com/in/iamfaham) & [X](https://x.com/iamfaham)!
