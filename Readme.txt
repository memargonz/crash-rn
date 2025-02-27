echo "# crash-rn" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/memargonz/crash-rn.git
git push -u origin main

To install dependencies to the app, run the following:

npm install --legacy-peer-deps

To run the app, execute

npm run dev