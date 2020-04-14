import * as nodemailer from "nodemailer";

export class Emailer {

    private from: string = "Novugrid <dharmochy@gmail.com>";
    private to!: string;
    private subject!: string;
    private html!: string;

    constructor(private userName: string = "dharmochy@gmail.com", 
        private password: string = "#dharmochy098") { }

    // constructor() {}
    public setFromTo(to: string, from?: string): Emailer {
        if (from) {
            this.from = from;
        }
        this.to = to;
        return this;
    }

    public setSubject(subject: string): Emailer {
        this.subject = subject;
        return this;
    }

    public setHtml(html: string): Emailer {
        this.html = html;
        return this;
    }

    public async send(): Promise<any> {

        let error: Error; // = Error();

        if (this.to === undefined || this.to === "") {
            error = new Error("Please provide email");
            error.name = "ToNotProvided";
        }

        if (this.subject === undefined || this.subject === "") {
            error = new Error("Please provide to recipient");
        }

        // First we need a constructor to build our transport system
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.userName,
                pass: this.password,
            },
        });

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: this.subject,
            html: this.html, // "<h1>Welcome</h1><p>Thanks for signing up cheers...<p>",
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Email failed to send to user...", err);
            } else {
                console.log("Email was successfully sent to the user", info);
            }
        });

        return new Promise((resolve, reject) => {
            if (error != null) { reject(error); }
            resolve({});
        });

    }

}
