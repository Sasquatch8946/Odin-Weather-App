import PubSub from 'pubsub-js';

const displayController = (function () {
    const startSearch = function (event) {
        if (event.type === 'click' || event.key === 'Enter') {
            event.preventDefault();
            const field = document.getElementById('location');
            const location = field.value;
            PubSub.publish("searchStarted", location);
            field.value = '';
        }
    }

    const activateSubmit = function () {
        document.querySelector("button[type='submit']").addEventListener("click", startSearch);
        document.querySelector("input[type='text']").addEventListener("keydown", startSearch);
    }


    return {
        activateSubmit,
    }
})();

export default displayController.activateSubmit;