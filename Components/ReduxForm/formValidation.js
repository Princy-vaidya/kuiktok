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
//    errors.phoneNumber = 'PhoneNo is required'
//  } else if (values.phoneNumber.length !=10) {
//    errors.phoneNumber = 'must be 10 digits'
//  }
 if (!values.otp) {
   errors.otp = 'Otp is required'
 } else if (values.otp.length !=4) {
   errors.otp = 'must be 4 digits'
 }
 if (!(values.password || values.cnfpassword)) {
   errors.password = 'Password is required'
 } else if (values.password <  8) {
   errors.password = 'Password shouldn' + "'" + 't be less than 7 characters'
 } else if (values.password != values.cnfpassword) {
   errors.cnfpassword = 'Password should be Same.'
 }
  if (!values.currentPassword) {
  errors.currentPassword = 'Current password is required'
}
 return errors;
};
 export default validate
