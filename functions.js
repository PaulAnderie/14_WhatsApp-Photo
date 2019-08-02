const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
const uploadImage = promisify(cloudinary.uploader.upload);
const cloudinaryTransforms = {
    transformation: [
        { aspect_ratio: 0.75, crop: "crop" },
        { height: 1600, crop: "scale"},
        {
            overlay: "overlay-photo",
            flags: "relative",
            height: "1.0",
            width: "1.0"
        }
        ]
};


exports.handler = async function(context, event, callback) {
    let twiml = new Twilio.twiml.MessagingResponse();
    
    if (!event.MediaUrl0) {
        twiml.message('Bitte schicke mir ein Foto');
        callback(null, twiml);
        return;
    }
    
    const res = await uploadImage(event.MediaUrl0, {
        public_id: event.MessageSid,
        eager: [cloudinaryTransforms]
    });
    const url = res.eager[0].secure_url;
    
    twiml.message("Danke").media(url);
	callback(null, twiml);
}