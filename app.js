var ccInfoShow = false;
var errorMessages = [];
var validate = false;

function showErrorMessage () {
    var errorContainer = document.getElementById('error-container');
    var errors = document.getElementById('error-message');
    if(errorMessages.length>0) {
        errors.innerHTML = errorMessages[0];
        errorContainer.style.display = 'block';
    } else {
        errorContainer.style.display = 'none';
    }
}

function blankInputCheck(field) {
    if (!validate) {
        return false;
    } else {
        var firstInputs = ['first-name', 'last-name', 'email', 'password', 'mobile-number'];
        var secondInputs = ['credit-card-number', 'credit-card-date', 'cvc'];
        var agentInputs;
        if (field) {
            agentInputs = [field];
        } else {
            if(ccInfoShow){
                agentInputs = firstInputs.concat(secondInputs);
            } else {
                agentInputs = firstInputs;
            }
        }
        var msgEnding= ' field may not be blank';
        for(var i=agentInputs.length-1; i>=0; i--){
            var msg = agentInputs[i].charAt(0).toUpperCase() + agentInputs[i].slice(1).replace(/-/g," ") + msgEnding;
            var val = document.forms['agentSignup'][agentInputs[i]].value;
            var errorField = document.getElementById(agentInputs[i]);
            var isErrorClass=errorField.classList.contains('blank-error');
            var isErrorMsg=errorMessages.indexOf(msg)!=-1;
            if (val=='') {
                if (!isErrorClass) {
                    errorField.classList.add('blank-error');
                    if(!isErrorMsg) {
                        errorMessages.unshift(msg);
                        showErrorMessage();
                    }
                } 
            } else {
                if (isErrorClass) {
                    errorField.classList.remove('blank-error');
                    if(errorMessages.indexOf(msg)!=-1) {
                        console.log('removing', msg, errorMessages)
                        var index = errorMessages.indexOf(msg);
                        errorMessages.splice(index, 1);
                        showErrorMessage();
                    }
                }
            }
        }
        var noFNameErr = errorMessages.indexOf('First name field may not be blank')==-1;
        var noLNameErr = errorMessages.indexOf('Last name field may not be blank')==-1;
        var noEmailErr = errorMessages.indexOf('Email field may not be blank')==-1;
        var noPassErr = errorMessages.indexOf('Password field may not be blank')==-1;
        var noMobileErr = errorMessages.indexOf('Mobile number field may not be blank')==-1;
        if(noFNameErr&&noLNameErr&&noEmailErr&&noPassErr&&noMobileErr){
            if(ccInfoShow) {
                var noCcNumberErr = errorMessages.indexOf('Credit card number field may not be blank')==-1;
                var noCcDateErr = errorMessages.indexOf('Credit card date field may not be blank')==-1;
                var noCvcErr = errorMessages.indexOf('Cvc field may not be blank')==-1;
                console.log(noCvcErr, noCcNumberErr, noCcDateErr)
                if(noCcNumberErr&&noCcDateErr&&noCvcErr){
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
};

function dataValidCheck(field) {
    if (!validate) {
        return false;
    } else {
        var target;
        if(field) {
            target=[field];
        } else {
            target=['email','password','mobile-number'];
        }
        var msg, check;
        for(var i=0;i<target.length;i++){
            errorField = document.getElementById(target[i]);
            val = errorField.value;
            if (val==''){
                return false;
            } else {
                if(target[i]=='email'){
                    msg='Email is an invalid format';
                    check = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                } else if (target[i]=='password') {
                    msg='Password must be at least 6 characters and contain at least one number, one lowercase and one uppercase letter';
                    check = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
                } else if (target[i]=='mobile-number') {
                    msg='Mobile number must be in a 10 number format. (1234567890)';
                    check = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
                }
                var isValid = check.test(val);
                var isErrorClass=errorField.classList.contains('error');
                var isErrorMsg=errorMessages.indexOf(msg)!=-1;
                if (!isValid) {
                    if (!isErrorClass) {
                        errorField.classList.add('error');
                        if(!isErrorMsg){
                            errorMessages.push(msg);
                        }
                    }
                    showErrorMessage();
                } else {
                    if (isErrorClass) {
                        errorField.classList.remove('error');
                    }
                    if(isErrorMsg) {
                        var index = errorMessages.indexOf(msg);
                        errorMessages.splice(index, 1);
                    }
                    showErrorMessage();
                }
            }
        }
    }
    var noEmailErr = errorMessages.indexOf('Email is an invalid format')==-1;
    var noPassErr = errorMessages.indexOf('Password must be at least 6 characters and contain at least one number, one lowercase and one uppercase letter')==-1;
    var noMobileErr = errorMessages.indexOf('Mobile number must be in a 10 number format. (1234567890)')==-1;
    if(noEmailErr&&noPassErr&&noMobileErr){
        return true;
    } else {
        return false;
    }
};

function licenseCheck () {
    console.log('lic checked')
    if (!validate) {
        return false;
    } else {
        var licensed = document.forms['agentSignup']['licensed'];
        var licensedBox = document.getElementById('licensed-box');
        var msg='Please confirm you are a licensed Agent';
        var isErrorClass=licensedBox.classList.contains('error');
        var isErrorMsg=errorMessages.indexOf(msg)!=-1;
        if(licensed.checked==false) {
            if (!isErrorClass) {
                licensedBox.classList.add('error');
                if(!isErrorMsg){
                    errorMessages.push(msg);
                }
            }
            showErrorMessage();
            return false;
        } else {
            if (isErrorClass) {
                licensedBox.classList.remove('error');
            }
            var index = errorMessages.indexOf(msg);
            if(index!=-1) {
                errorMessages.splice(index, 1);
            }
            showErrorMessage();
            return true;
        }
    }
    return false;
};

function dropdownCheck (field) {
    if (!validate) {
        return false;
    } else {
        var firstDropdowns = ['prefix', 'plan'];
        var secondDropdowns = ['referral'];
        var dropdowns;
        var msgBeginning = "Please select a ";
        var msgEnding = " from the dropdown"
        if(field) {
            dropdowns = [field];
        } else {
            if(ccInfoShow){
                dropdowns = firstDropdowns.concat(secondDropdowns);
            } else {
                dropdowns = firstDropdowns;
            }
        }
        for (var i=0; i<dropdowns.length; i++) {
            var msg= msgBeginning + dropdowns[i] + msgEnding;
            var target = document.getElementById(dropdowns[i]);
            if(target.value=='') {
                if (!target.classList.contains('error')) {
                    target.classList.add('error');
                    if(errorMessages.indexOf(msg)==-1){
                        errorMessages.push(msg);
                    }
                }
                showErrorMessage();
            } else {
                if (target.classList.contains('error')) {
                    target.classList.remove('error');
                }
                    var index = errorMessages.indexOf(msg);
                    if(index!=-1) {
                        errorMessages.splice(index, 1);
                    }
                showErrorMessage();
            }
        }
        var noPrefixErr = errorMessages.indexOf('Please select a prefix from the dropdown')==-1;
        var noPlanErr = errorMessages.indexOf('Please select a plan from the dropdown')==-1;
        if(noPlanErr&&noPrefixErr){
            if(ccInfoShow){
                if(noRefErr = errorMessages.indexOf('Please select a referral from the dropdown')==-1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }
        return false;
    }
};

function ccCheck () {
    console.log('ccCheck called');
};

function ccDateCheck () {
    console.log('ccDateCheck called');
};

function cvcCheck () {
    console.log('cvcCheck called');
};

function validateForm (event) {
    if(event){
        event.preventDefault();
        event.stopPropagation();
    }
    validate = true;
    var blank = blankInputCheck();
    var dataValid = dataValidCheck();
    var license = licenseCheck();
    var dropdowns = dropdownCheck();
    if(blank&&dataValid&&dropdowns&&license) {
        document.getElementById('agent-form-second').style.display = 'block';
        ccInfoShow = true;
        document.getElementById('first-half-btn').style.display='none';
        return true;
    }
    return false;
};

agentSignup.onsubmit = function() {
    if(validateForm()){
        alert('Form is valid!');
        return true;
    } else {
        alert('Form is not valid. Please fix the errors before submitting.');
        return false;
    }
    return false;
};

function valadationInit () {
    document.getElementById('error-container').style.display ='none';
    document.getElementById('agent-form-second').style.display ='none';
};

valadationInit();
