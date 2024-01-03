const axiosInstance = axios.create({
    baseURL : 'https://crudcrud.com/api/1e50a8de21844c7eb6c6c6f1352bcad2'
});
var total = 0;
function handleFormSubmit(event) {
    event.preventDefault();
    const price = event.target.sPrice.value;
    const pName = event.target.pName.value;

    const obj = {
        price,
        pName
    }

    axiosInstance.post('/products', obj)
        .then(res => showNewUser(res.data))
        .catch(err => console.error(err));
    
}
window.addEventListener('DOMContentLoaded', () => {
    axiosInstance.get('/products')
    .then(res => {
        console.log(res.data);
        for(var i=0; i<res.data.length; i++){
            showNewUser(res.data[i]);
        }
    })
    .catch(err => console.error(err));
})

function showNewUser(user){
    document.getElementById('sPrice').value = '';
    document.getElementById('pName').value = '';

    const parent = document.getElementById('listOfItems');
    const li = document.createElement('li');
    li.innerText = `${user.price} - ${user.pName} `
    total += parseInt(user.price);

    const input = document.createElement('input');
    input.type = 'button';
    input.value = 'Delete Product';

    const span = document.getElementById('total');
    span.innerText = ` Rs ${total}`;

    input.onclick = () => {
        axiosInstance.get(`/products/${user._id}`)
        .then(res => {
            total -= parseInt(res.data.price);
            const span = document.getElementById('total');
            span.innerText = ` Rs ${total}`;
            return axiosInstance.delete(`/products/${user._id}`);
        })
        .then();
        parent.removeChild(li);
    }

    li.appendChild(input);
    parent.appendChild(li);
}
