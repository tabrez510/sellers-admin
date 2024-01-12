const axiosInstance = axios.create({
    baseURL : 'https://crudcrud.com/api/df4506280ee24ac1a73703132c834283'
});
var total = 0;
async function handleFormSubmit(event) {
    event.preventDefault();
    const price = event.target.sPrice.value;
    const pName = event.target.pName.value;

    const obj = {
        price,
        pName
    }
    try {
        const res = await axiosInstance.post('/products', obj);
        showNewProduct(res.data, null);
    }
    catch(err){
        console.log(err);
        alert(err.message);
    }
}
window.addEventListener('DOMContentLoaded', async () => {
    try{
        const res = await axiosInstance.get('/products')
        for(var i=0; i<res.data.length; i++){
            showNewProduct(res.data[i], null);
        }
    }
    catch(err){
        console.log(err);
        alert(err.message);
    }
})

function showNewProduct(product, nextProduct){
    document.getElementById('sPrice').value = '';
    document.getElementById('pName').value = '';

    const parent = document.getElementById('listOfItems');
    const li = document.createElement('li');
    li.innerText = `${product.price} - ${product.pName} `
    total += parseInt(product.price);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.innerHTML = 'Delete Product';
    deleteButton.id = 'deleteBtn';

    const span = document.getElementById('total');
    span.innerText = ` Rs ${total}`;

    deleteButton.onclick = async (event) => {
        try{
            parent.removeChild(li);
            total -= parseInt(event.target.parentElement.innerText);
            const span = document.getElementById('total');
            span.innerText = ` Rs ${total}`;
            const res = await axiosInstance.delete(`/products/${product._id}`)
            console.log(res);
        }
        catch(err){
            console.log(err);
            alert(err.message);
        }
    }

    const edit = document.createElement('button');
    edit.type = 'button';
    edit.innerHTML = 'Edit';
    edit.id = 'editBtn';

    edit.onclick = (event) => {
        const arr = event.target.parentElement.textContent.split(" - ");
        const nextSibling = event.target.parentElement.nextSibling;
        console.log(nextSibling);
        document.getElementById('sPrice').value = arr[0];
        document.getElementById('pName').value = arr[1].split(' ')[0];
        parent.removeChild(li);
        total -= arr[0];
        const span = document.getElementById('total');
        span.innerText = ` Rs ${total}`;
        document.getElementById('submit').style.display = 'none';
        document.getElementById('edit').style.display = 'inline-block';

        document.getElementById('edit').onclick = async () => {
            try {
                const price = document.getElementById('sPrice').value;
                const pName = document.getElementById('pName').value;
                document.getElementById('submit').style.display = 'inline-block';
                document.getElementById('edit').style.display = 'none';
    
                const obj = {
                    price,
                    pName
                }
                const res = await axiosInstance.put(`/products/${product._id}`, obj)
                showNewProduct({"_id" : product._id, ...obj}, nextSibling);
            }
            catch(err){
                console.log(err);
                alert(err.message);
            }
        }
    }
    li.appendChild(deleteButton);
    li.appendChild(edit);
    if(nextProduct==null){
        parent.appendChild(li);
    }
    else {
        parent.insertBefore(li, nextProduct);
    }
}