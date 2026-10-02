# CCIS Teachers’ Day Message Wall

A simple and heartfelt web experience created for the **College of Computing and Information Sciences** to celebrate **Teachers’ Day 2026**.

Students can choose someone from the CCIS community, leave a message of appreciation, and browse messages shared for faculty members, BLIS personnel, and other members of the community.

---

## ✨ Overview

The CCIS Teachers’ Day Message Wall was designed to give students a clean and meaningful way to say **thank you**.

Instead of a traditional greeting board, the platform provides individual message walls where appreciation messages can be written and viewed in one place.

The project focuses on a minimal interface, responsive design, smooth interactions, and an easy experience across desktop and mobile devices.

---

## Features

### Leave a Message

Students can browse the directory and choose the person they would like to thank.

Each individual page provides a dedicated message form where students can:

- Enter their name or remain anonymous
- Write a Teachers’ Day message
- Submit a message of appreciation
- Receive a randomly generated avatar for their message

### View Messages

A dedicated message page makes it easier to read messages shared across the community.

Messages can be:

- Searched
- Filtered by category
- Filtered by recipient
- Sorted by newest or oldest
- Sorted alphabetically by recipient
- Expanded using **See more** for longer messages

### Community Directory

The directory currently includes:

- CCIS
- BLIS
- Personnel

Users can search for a person, filter by category, and sort names alphabetically.

### Responsive Design

The interface is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

The layout automatically adapts while maintaining the same clean visual style.

### Smooth Interface

The application includes subtle transitions and micro-interactions for:

- Page navigation
- Directory filtering
- Dropdown menus
- Message cards
- Buttons
- Message expansion

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| React | User interface |
| TypeScript | Type-safe development |
| Vite | Development and build tool |
| Tailwind CSS | Styling |
| React Router | Client-side routing |
| Lucide React | Interface icons |
| DiceBear | Generated message avatars |
| Supabase | Database and backend integration |
| Vercel | Deployment |

---

## Project Structure

```text
src/
├── assets/
│   └── ccis-logo.png
│
├── components/
│   ├── AvatarStack.tsx
│   └── Navbar.tsx
│
├── data/
│   ├── faculty.ts
│   └── messages.ts
│
├── pages/
│   ├── Home.tsx
│   ├── Faculty.tsx
│   ├── Person.tsx
│   └── Messages.tsx
│
├── App.tsx
├── index.css
└── main.tsx
