// var bcrypt = require('bcryptjs');
// var salt = bcrypt.genSaltSync(8);
// var hash = bcrypt.hashSync("refnaldy", salt);
// console.log(hash)

// console.log(bcrypt.compareSync('refnaldy', hash))





// ==================================




// Importing pict-url's module
const pictURL = require('pict-url');

// Getting the default Provider
const Imgur = pictURL.Provider.Imgur;

// Creating a basic new Client instance
const Client = new pictURL.Client(Imgur);

// Get an image by tag
let category = "doggos";
let imageLink = "";
Client.getImage(category)
    .then((image) => {

        // Image is a basic object
        imageLink = image.url;
        console.log(imageLink)
    })
    .catch(err => {
        console.log(err)
    })
