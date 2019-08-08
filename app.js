document.addEventListener("DOMContentLoaded", function(event) { 

    class Form {
        constructor(id) {
            this.errorMsgs = [];
            this.id = id;
            this.form = null;
            this.submitted = false;
        }

        init () {
            this.form = document.querySelector('form#' + this.id );

            let cancel = this.form.getElementsByClassName('form-cancel');
            for(let i = 0; i<cancel.length; i++) {
                cancel[i].addEventListener('click', this.reset.bind(this));
            }
            let sbmt = this.form.getElementsByClassName('form-submit');
            for(let i = 0; i<sbmt.length; i++) {
                sbmt[i].addEventListener('click', this.submit.bind(this));
            }
            let inputs = this.form.getElementsByClassName('form-data');
            for (let i=0; i<inputs.length; i++ ) {
                inputs[i].addEventListener('blur', this.blurHandler.bind(this));
            }
        }

        blurHandler (e) {
            if(this.submitted) {
                e.preventDefault();
                this.validate([e.target]);
            }
        }

        reset (e) {
            e.preventDefault();
            if(e.target.nodeName === "BUTTON") {
                this.form = e.target.closest('form');
                this.id = null;
                this.form.querySelector('.error-display').innerHTML='';
                this.errorMsgs = [];
                let inputs = this.form.getElementsByClassName('form-data');
                for(let i=0; i<inputs.length; i++) {
                    if (inputs[i].classList.contains('danger')) {
                        inputs[i].classList.remove("danger");
                    }
                    if (inputs[i].parentNode.classList.contains('danger')) {
                        inputs[i].parentNode.classList.remove("danger");
                    }
                }
                this.form.reset();
            } else {
                return false;
            }
        }

        validate (inputs) {
            for(let i=0; i<inputs.length; i++) {
                let error = false;
                let target = null;
                let val = null;
                let name = inputs[i].name;
                let type = inputs[i].type;

                if (inputs[i].type==="checkbox"){
                    target = inputs[i].parentNode;
                    val = inputs[i].checked;
                } else {
                    target = inputs[i];
                    val = inputs[i].value;
                }
                if (target.classList.contains('danger')) {
                    target.classList.remove("danger");
                }

                if (!(val)) {
                    error = true;
                } else if (inputs[i].name === 'email') {
                    if (!(/^\w+([\.-]?\w+)*@\w([\.-]?\w+)*(\.\w{2,3})+$/.test(inputs[i].value))) {
                        error = true;
                    }
                } else if (inputs[i].name === 'password') {
                    if (!(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(inputs[i].value))) {
                        error = true;
                    }
                } else if (inputs[i].name === 'phone') {
                    if(!(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(inputs[i].value))) {
                        error = true;
                    }
                } else if (inputs[i].name === 'credit-card') {
                    var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
                    var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
                    var amexpRegEx = /^(?:3[47][0-9]{13})$/;
                    var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
                    var isValid = false;
                    
                    if (visaRegEx.test(inputs[i].value)) {
                        isValid = true;
                    } else if(mastercardRegEx.test(inputs[i].value)) {
                        isValid = true;
                    } else if(amexpRegEx.test(inputs[i].value)) {
                        isValid = true;
                    } else if(discovRegEx.test(inputs[i].value)) {
                        isValid = true;
                    }

                    if(!(isValid)) {
                        error = true;
                    }
                } else if (inputs[i].name === 'expiration') {
                    if (inputs[i].value.match(/^(0\d|1[0-2])\/\d{2}$/)) {
                        const {0: month, 1: year} = inputs[i].value.split("/");

                        const expiry = new Date("20"+year, month);
                        const current = new Date();
                        
                        if (!(expiry.getTime() > current.getTime())) {
                            error = true;
                        }
                    } else {
                        error = true;
                    }
                }  else if (inputs[i].name === 'cvv') {
                    if(!(/^[0-9]{3,4}$/.test(inputs[i].value))) {
                        error = true;
                    }
                }

                if (error) {
                    let newErr = this.createErrorMsg({target: target, type: type, name: name, val: val});
                    if ( this.errorMsgs.length ) {
                        let idx = this.checkErrorMsgs(name);
                        if (idx === -1) {
                            this.errorMsgs.push({msg: newErr, name: inputs[i].name});
                        } else {
                            this.errorMsgs[idx] = {msg: newErr, name: inputs[i].name}
                        }
                    } else {
                        this.errorMsgs.push({msg: newErr, name: inputs[i].name});
                    }
                } else {
                    this.removeErrMsg(name);
                }
            }

            let errorDisplay = this.form.querySelector('.error-display');
            errorDisplay.innerHTML='';
            if (this.errorMsgs.length > 0) {
                for (let i=0; i<this.errorMsgs.length; i++) {
                    let child = document.createElement("LI");
                    child.className = "danger error-msg";
                    let html = this.errorMsgs[i].msg;
                    var textnode = document.createTextNode(html);
                    child.appendChild(textnode);
                    errorDisplay.appendChild(child);
                }
                return false;
            } else {
                return true;
            }
        };

        removeErrMsg (name) {
            for(var i = this.errorMsgs.length-1; i>=0; i--) {
                if (name === this.errorMsgs[i].name) {
                    this.errorMsgs.splice(i,1);
                }
            }
        }

        checkErrorMsgs (n) {
            for(let i = this.errorMsgs.length-1; i>=0; i--) {
                if (n === this.errorMsgs[i].name) {
                    return i
                }
            } 
            return -1;
        }

        createErrorMsg (obj) {
            if (!(obj.target.classList.contains("danger"))) {
                obj.target.classList.add("danger");
            }
            let errorMsgs = {
                human: 'you are human',
                blank: ' may not be blank',
                invalid: ' is invalid',
                password: ' must be at least six characters long and have at least one uppercase, one lowercase and one special character',
                select: 'Please select a '
            };

            if(obj.type==="checkbox") { return "Please confirm " + errorMsgs[obj.name] }
            if(obj.type==="select-one") { return errorMsgs.select + obj.name }
            obj.name = obj.name.charAt(0).toUpperCase() + obj.name.slice(1).replace(/-/g, " ");
            if(obj.name==="Cvv") { obj.name="CVV"}
            if (obj.type==="password") {
                return obj.val?(obj.name + errorMsgs.password):(obj.name + errorMsgs.blank);
            }
            if (!(obj.val)) { return obj.name + errorMsgs.blank } 
            else { return obj.name + errorMsgs.invalid }
        };

        submit (e) {
            e.preventDefault();
            this.submitted = true;
            if(e.target.nodeName === "BUTTON") {
                this.form.querySelector('.error-display').innerHTML='';
                this.errorMsgs = [];
                this.form = e.target.closest('form');
                this.id = e.target.closest('form').id;
                let inputs = this.form.getElementsByClassName("form-data");
                if(this.validate(inputs)) {
                    alert('submitting!')
                    this.form.submit();
                } else {
                    console.log('form can not submit')
                }
            }
        }
    }

    // !!params must match form id!!
    const testform = new Form('testform');
    testform.init();
    const emailform = new Form('emailform');
    emailform.init();
});
