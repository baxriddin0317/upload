## Upload App
A simple file upload app built with Next.js, Firebase, and Tailwind CSS.

## Overview
This app allows users to upload files to Firebase Storage using Next.js as the front-end framework, Firebase for backend storage, and Tailwind CSS for styling.

Table of Contents
- Installation
- Configuration
- Run
- Firebase Connection
- Usage
- License

## Installation
Make sure you have Node.js installed on your machine.

Clone the repository:
```bash
git clone https://github.com/baxriddin0317/upload.git
```
Change into the project directory:
```bash
cd upload
```

Install dependencies:
```bash
npm install
```


## Configuration

Create a .env.local file in the root of the project and add the following configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
```

Replace your-firebase-api-key, your-firebase-auth-domain, and other placeholders with your actual Firebase project credentials.

## Run

To start the development server, run:

```bash
npm run dev
```

Visit http://localhost:3000 to view the app.


## Firebase Connection

Ensure your Firebase Storage rules allow read and write access. Here is a sample rule for testing:

```bash
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write;
    }
  }
}
```

Adjust the rules based on your security requirements for production.

## Usage

- Visit the app at http://localhost:3000.
- Click on the "Upload" button to select a file.
- The file will be uploaded to Firebase Storage, and a link will be displayed.

Feel free to customize and enhance the app based on your specific requirements!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.