const validate = values => {
    const errors = {};
    if (!values.email) {
     errors.email = 'Email is required'
   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
     errors.email = 'Invalid email address'
   }
   if (!values.username) {
     errors.username = 'Name is required'
   } else if (values.username.length <  3) {
     errors.username = 'Name must be 3 characters long'
   }
  //  if (!values.phoneNumber) {
  //   errors.phoneNumber = 'Phone number is required'
  // } else if (values.phoneNumber.length !=10) {
  //   errors.phoneNumber = 'must be 10 digits'
  // }
   if (!values.age || new Date(values.age).getTime() > new Date().getTime()) {
    errors.age = 'DOB is required !'
  }
   else if (new Date(values.age).getTime() > new Date().getTime()) {
     errors.age = "DOB can't be future date !"
   }
   if (!values.language) {
    errors.language = 'Language is required'
  }
  if (!values.location) {
    errors.location = 'Location is required'
  }
  if (!values.ocupation) {
    errors.ocupation = 'Ocupation is required'
  }
  if (!values.address) {
    errors.address = 'Address is required'
  }
  if (!values.field) {
    errors.field = 'field is required'
  }
  if (!values.specialization) {
    errors.specialization = 'Specialization is required'
  }
  if (!values.consultingrate) {
    errors.consultingrate = 'Your consulting rate after 3 minutes is required'
  }
  if (!values.experience) {
    errors.experience = 'Years of experience is required'
  }
  if (!values.contact) {
    errors.contact = 'Contact is required'
  }
  if (!values.aboutyou) {
    errors.aboutyou = 'aboutYou is required'
  }
  if (!values.linkdinlink) {
    errors.linkdinlink = 'Linkedin Link is required'
  }
   return errors;
  };
   export default validate
  