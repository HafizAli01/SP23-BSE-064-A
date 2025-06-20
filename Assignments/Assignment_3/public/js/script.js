// Auto-hide flash messages after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(function(message) {
        setTimeout(function() {
            const alert = new bootstrap.Alert(message);
            alert.close();
        }, 5000);
    });
});

// Add to cart functionality
function addToCart(productId, quantity = 1) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/cart/add/${productId}`;
    
    const quantityInput = document.createElement('input');
    quantityInput.type = 'hidden';
    quantityInput.name = 'quantity';
    quantityInput.value = quantity;
    
    form.appendChild(quantityInput);
    document.body.appendChild(form);
    form.submit();
} 