document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('shipping-form');

    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const postalCode = document.getElementById('postal-code');
    const creditCard = document.getElementById('credit-card');
    const expiryDate = document.getElementById('expiry-date');
    const cvv = document.getElementById('cvv');

    form.addEventListener('submit', function (event) {
        let isValid = true;

        function showError(input, errorId, message) {
            document.getElementById(errorId).textContent = message;
            input.classList.add('invalid');
            isValid = false;
        }

        function clearError(input, errorId) {
            document.getElementById(errorId).textContent = '';
            input.classList.remove('invalid');
        }

        if (!firstName.validity.valid) {
            showError(firstName, 'first-name-error', 'First name must contain only letters.');
        } else {
            clearError(firstName, 'first-name-error');
        }

        if (!lastName.validity.valid) {
            showError(lastName, 'last-name-error', 'Last name must contain only letters.');
        } else {
            clearError(lastName, 'last-name-error');
        }

        if (!email.validity.valid || !email.value.includes('@')) {
            showError(email, 'email-error', 'Please enter a valid email address (must contain "@").');
        } else {
            clearError(email, 'email-error');
        }

        if (!phone.validity.valid) {
            showError(phone, 'phone-error', 'Only Digits and Phone number must be 7 to 15 digits.');
        } else {
            clearError(phone, 'phone-error');
        }

        if (!address.validity.valid) {
            showError(address, 'address-error', 'Address is required.');
        } else {
            clearError(address, 'address-error');
        }

        if (!city.validity.valid) {
            showError(city, 'city-error', 'City is required.');
        } else {
            clearError(city, 'city-error');
        }

        if (!postalCode.validity.valid) {
            showError(postalCode, 'postal-code-error', 'Postal code is required.');
        } else {
            clearError(postalCode, 'postal-code-error');
        }

        if (!creditCard.validity.valid) {
            showError(creditCard, 'credit-card-error', 'Credit card must be 16 digits.');
        } else {
            clearError(creditCard, 'credit-card-error');
        }

        const selectedDate = new Date(expiryDate.value + "-01"); 
        const today = new Date();
        if (!expiryDate.validity.valid || selectedDate <= today) {
            showError(expiryDate, 'expiry-date-error', 'Expiry date must be in the future.');
        } else {
            clearError(expiryDate, 'expiry-date-error');
        }

        if (!cvv.validity.valid) {
            showError(cvv, 'cvv-error', 'CVV must be 3 digits.');
        } else {
            clearError(cvv, 'cvv-error');
        }

        if (!isValid) {
            event.preventDefault(); 
        } else {
            form.reset(); 
        }
    });
});
