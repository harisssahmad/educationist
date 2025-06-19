<p align="center"><img src="https://harisssahmad.github.io/img/educationist-sm.png" alt="project-image"></p>

<h1 align="center" id="title">Educationist</h1>

<p id="description">Welcome to the GitHub repository of the app Educationist, an Ad-free O' Level past papers catalogue for students and teachers. Available for free on the <a href="https://play.google.com/store/apps/details?id=com.harisssahmad.educationist" target="_blank">Play Store</a>.<br/>
This repository serves as the <i>database</i> for past papers available in the application's new version, which is currently in the works!
</p>

### Tester Utility

The tester utility is is written in JavaScript to test the JSON files contributed by everyone, and you can use it to test your JSON links.

#### How to use the utility:

1. Make sure you have Node JS installed on your machine [(How to install Node JS)](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
2. Download/clone the repository
3. OPTIONAL: Make changes to the JSON in the parent directory (You can even check the already added past papers for us and submit issues if an existing link is not working!)
4. Make sure you `cd` into `tester-util` folder
5. Run the following command:
   `npm install`
6. Now, you can check any JSON file by running the following command:
   `node tester.js PATH_TO_JSON.json` - Make sure that the path provided is correct! - If a JSON is completely OK, the response should be something like this:
   `
	Total files checked: 234
	OK responses: 234
	NOT-OK responses: 0
	` - If a JSON file has issues, the response will have a `NOT-OK` count of more than 0, and a CSV file containing all the `NOT-OK` links will be generated.
