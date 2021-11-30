const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1", // Make sure this corresponds to the region in which you have verified your email address (or 'eu-west-1' if you are using the Spiced credentials)
});

module.exports.sendEmail = () => {
    return ses
        .sendEmail({
            Source: "soft.lanyard@spicedling.email",
            Destination: {
                ToAddresses: ["xiaozheng.zoey@gmail.com"],
            },
            Message: {
                Body: {
                    Text: {
                        Data: "[Content]We can't wait to start working with you! Please arrive on Monday at 9:00 am. Dress code is casual so don't suit up.",
                    },
                },
                Subject: {
                    Data: "[Subject]Your Application Has Been Accepted!",
                },
            },
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));
};
