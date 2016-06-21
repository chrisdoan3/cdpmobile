$(function () {
    var payeebox = document.getElementById("Payee");
    adjusttextareaheight(payeebox);
})

function adjusttextareaheight(textField) {
    if (textField.clientHeight < textField.scrollHeight) {
        textField.style.height = textField.scrollHeight + "px";
        if (textField.clientHeight < textField.scrollHeight) {
            textField.style.height =
              (textField.scrollHeight * 2 - textField.clientHeight) + "px";
        }
    }
}