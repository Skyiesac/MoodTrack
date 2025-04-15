# SoulSync

Awareness around mental well-being is rapidly increasing in today's society. SoulSync is an application designed to empower users to track and improve their mental status by providing journaling, mood tracking, and personal insights. SoulSync strives to promote self-awareness, allowing users to cultivate a balanced and healthy state of mind.

## Features

* Journaling: Record your thoughts and feelings in a secure, user-friendly journal.
* Mood Tracking: Log daily mood and identify recurring patterns over time.
* Personal Insights: Receive suggestions to improve psychological health.

## Features
### Front-End
- Interactive **Calendar** to browse and manage journal entries.
- Visualizations of mood trends with charts and graphs.
- User-friendly pages for **Journal Entries**, **New Journal Entry**, and **Settings**.
- Authentication pages for **Sign In** and **Sign Up**.
- Responsive design using **Tailwind CSS** for a seamless user experience across devices.

### Back-End
- **RESTful API** to handle journal entries, user authentication, and mood data.
- **Authentication** using secure methods to manage user sessions.
- Database integration to store user data, journal entries, and mood trends.

### Database
- Models for **Users**, **Journal Entries**, **Tags**, and **Mood Data**.
- Schemas defined in `db/schema.ts` to ensure structured and scalable data storage.

## Tech Stack
### Front-End
- **React**: For building dynamic and interactive UI components.
- **TypeScript**: Ensures type safety and maintainable front-end code.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: High-performance development server and build tool.

### Back-End
- **Node.js**: JavaScript runtime for server-side logic.
- **TypeScript**: For type-safe and maintainable back-end code.
- **RESTful API**: To handle data communication with the front-end.

### Database
- **Database Models**: Defined in `db/schema.ts` and `server/models`.
- Storage for user authentication, journal entries, and mood tracking.

## File Structure
### Root Level
- **`.env`**: Environment variables for sensitive information.
- **`package.json`**: Lists dependencies and scripts.
- **`postcss.config.js`**: Configuration for PostCSS.
- **`tailwind.config.ts`**: Configuration for Tailwind CSS.
- **`vite.config.ts`**: Vite build configuration.

### Front-End (`client/`)
- **`src/components`**: Contains reusable UI components.
- **`src/pages`**: Defines pages like Journal Entries, New Entry, and Authentication.
- **`src/hooks`**: Custom React hooks for specific logic.
- **`src/styles`**: CSS files for styling.
- **`src/utils`**: Helper functions like API calls and date formatting.

### Back-End (`server/`)
- **`auth.ts`**: Handles user authentication logic.
- **`routes.ts`**: Defines API endpoints for journal entries and user management.
- **`models/`**: Contains database models (e.g., User, Mood Entry).

### Database (`db/`)
- **`schema.ts`**: Defines database schemas.
- **`index.ts`**: Initializes the database connection.

---

## Installation

Before you get started, ensure you have Node.js and PostgresSQL installed.

### From your command line:

```bash
# Clone this repository
$ git clone git@github.com:Mykull06/projectSoulSync.git

# cd into repository
$ cd projectSoulSync

# install dependencies
$ npm install

# run the app
$ npm start
```



## Future Features
- Mood analysis using AI.
- Notifications and reminders for journaling.
- Sharing mood trends with trusted individuals.

## License
This project is licensed under the MIT License. 

## Credits
- Michael Garcia
- Alexander Barrios
- Tim Choe
- Simranjot Singh

