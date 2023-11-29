# firebase-cfworkers
 
Currently supports the following:
- [x] Firebase Auth
- [x] Firebase Firestore
- [ ] Firebase Storage
- [ ] Firebase Realtime Database
- [ ] Firebase Cloud Messaging

## Installation

```bash
npm install firebase-cfworkers
```

## Usage

```js
import { getApp, getAuth, getFirestore } from 'firebase-cfworkers';

const app = getApp({
  /* service account json */
});

const auth = getAuth(app);
const firestore = getFirestore(app);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.