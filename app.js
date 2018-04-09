document.addEventListener("DOMContentLoaded", function(event) { 

    // FORM CONSTRUCTOR
    function Form() {
        this.ccInfoShow = false;
        this.errorMessages = [];
        this.validate = false;
        this.allInputs = document.getElementsByTagName('input');
        this.valBtn = document.getElementById('validate-btn');
        this.license = document.getElementById('licensed');
        this.plan = document.getElementById('plan');
        this.prefix = document.getElementById('prefix');
        this.submit = document.getElementById('submit-form');
        this.referral = document.getElementById('referral');
        this.data = {
            'prefix':null,
            'first-name':null,
            'last-name':null,
            'email':null,
            'password':null,
            'mobile-number':null,
            'plan':null,
            'credit-card-number':null,
            'credit-card-date':null,
            'cvc':null,
            'referral':null,
            'licensed':false
        };
    };

    Form.prototype.licenseCheck = function () {
        console.log('license check hit', this.validate)
        if (!this.validate) {
            conslole.log('returning false');
            return false;
        } else {
            console.log('cont')
            var licensed = document.forms['agentSignup']['licensed'];
            var licensedBox = document.getElementById('licensed-box');
            var msg='Please confirm you are human';
            var isErrorClass=licensedBox.classList.contains('error');
            var isErrorMsg=this.errorMessages.indexOf(msg)!=-1;
            if(licensed.checked==false) {
                if (!isErrorClass) {
                    licensedBox.classList.add('error');
                    if(!isErrorMsg){
                        this.errorMessages.push(msg);
                    }
                }
                this.data.licensed=false;
                this.showErrorMessage();
                return false;
            } else {
                if (isErrorClass) {
                    licensedBox.classList.remove('error');
                }
                var index = this.errorMessages.indexOf(msg);
                if(index!=-1) {
                    this.errorMessages.splice(index, 1);
                }
                this.data.licensed=true;
                this.showErrorMessage();
                return true;
            }
        }
        return false;
    };

    Form.prototype.dataValidCheck = function (field) {
        if (!this.validate) {
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
                var errorField = document.getElementById(target[i]);
                var val = errorField.value;
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
                    var isErrorMsg=this.errorMessages.indexOf(msg)!=-1;
                    if (!isValid) {
                        if (!isErrorClass) {
                            errorField.classList.add('error');
                            if(!isErrorMsg){
                                this.errorMessages.push(msg);
                            }
                        }
                        this.data[target[i]]=null;
                        this.showErrorMessage();
                    } else {
                        if (isErrorClass) {
                            errorField.classList.remove('error');
                        }
                        if(isErrorMsg) {
                            var index = this.errorMessages.indexOf(msg);
                            this.errorMessages.splice(index, 1);
                        }
                        this.data[target[i]]=val;
                        this.showErrorMessage();
                    }
                }
            }
        }
        var noEmailErr = this.errorMessages.indexOf('Email is an invalid format')==-1;
        var noPassErr = this.errorMessages.indexOf('Password must be at least 6 characters and contain at least one number, one lowercase and one uppercase letter')==-1;
        var noMobileErr = this.errorMessages.indexOf('Mobile number must be in a 10 number format. (1234567890)')==-1;
        if(noEmailErr&&noPassErr&&noMobileErr){
            return true;
        } else {
            return false;
        }
    };

    Form.prototype.showErrorMessage = function () {
        var errorContainer = document.getElementById('error-container');
        var errors = document.getElementById('error-message');
        if(this.errorMessages.length>0) {
            errors.innerHTML = this.errorMessages[0];
            errorContainer.style.display = 'block';
        } else {
            errorContainer.style.display = 'none';
        }
    };

    Form.prototype.blankInputCheck = function (field) {
        if (!this.validate) {
            return false;
        } else {
            var firstInputs = ['first-name', 'last-name', 'email', 'password', 'mobile-number'];
            var secondInputs = ['credit-card-number', 'credit-card-date', 'cvc'];
            var agentInputs;
            if (field) {
                agentInputs = [field];
            } else {
                if(this.ccInfoShow){
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
                var isErrorMsg=this.errorMessages.indexOf(msg)!=-1;
                if (val=='') {
                    if (!isErrorClass) {
                        errorField.classList.add('blank-error');
                        if(!isErrorMsg) {
                            this.errorMessages.unshift(msg);
                            this.showErrorMessage();
                        }
                    }
                    if(agentInputs[i]=='first-name'||agentInputs[i]=='last-name'){
                        this.data[agentInputs[i]]=null;
                    }
                } else {
                    if (isErrorClass) {
                        errorField.classList.remove('blank-error');
                        if(this.errorMessages.indexOf(msg)!=-1) {
                            var index = this.errorMessages.indexOf(msg);
                            this.errorMessages.splice(index, 1);
                            this.showErrorMessage();
                        }
                    }
                    if(agentInputs[i]=='first-name'||agentInputs[i]=='last-name'){
                        this.data[agentInputs[i]]=val;
                    }
                }
            }
            var noFNameErr = this.errorMessages.indexOf('First name field may not be blank')==-1;
            var noLNameErr = this.errorMessages.indexOf('Last name field may not be blank')==-1;
            var noEmailErr = this.errorMessages.indexOf('Email field may not be blank')==-1;
            var noPassErr = this.errorMessages.indexOf('Password field may not be blank')==-1;
            var noMobileErr = this.errorMessages.indexOf('Mobile number field may not be blank')==-1;
            if(noFNameErr&&noLNameErr&&noEmailErr&&noPassErr&&noMobileErr){
                if(this.ccInfoShow) {
                    var noCcNumberErr = this.errorMessages.indexOf('Credit card number field may not be blank')==-1;
                    var noCcDateErr = this.errorMessages.indexOf('Credit card date field may not be blank')==-1;
                    var noCvcErr = this.errorMessages.indexOf('Cvc field may not be blank')==-1;
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

    Form.prototype.dropdownCheck = function (field) {
        if (!this.validate) {
            if(field){
                 var singleDD = document.getElementById(field);
                 if(singleDD.value!=''){
                    singleDD.style.color = '#000';
                 }
            }
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
                if(this.ccInfoShow){
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
                        if(this.errorMessages.indexOf(msg)==-1){
                            this.errorMessages.push(msg);
                        }
                    }
                    this.data[dropdowns[i]]=null;
                    this.showErrorMessage();
                } else {
                    target.style.color = '#000';
                    if (target.classList.contains('error')) {
                        target.classList.remove('error');
                    }
                    var index = this.errorMessages.indexOf(msg);
                    if(index!=-1) {
                        this.errorMessages.splice(index, 1);
                    }
                    this.data[dropdowns[i]]=target.value;
                    this.showErrorMessage();
                }
            }
            var noPrefixErr = this.errorMessages.indexOf('Please select a prefix from the dropdown')==-1;
            var noPlanErr = this.errorMessages.indexOf('Please select a plan from the dropdown')==-1;
            if(noPlanErr&&noPrefixErr){
                if(this.ccInfoShow){
                    if(noRefErr = this.errorMessages.indexOf('Please select a referral from the dropdown')==-1) {
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

    Form.prototype.submitForm = function(event) {
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        if(this.validateForm()){
            alert('Prefix: ' + this.data.prefix + '\nFirstName: ' + 
                this.data['first-name'] + '\nLast name: ' + 
                this.data['last-name'] + '\nemail: ' + 
                this.data.email + '\npassword: ' + 
                this.data.password + '\nMobile: ' + 
                this.data['mobile-number'] + '\nPlan: ' + 
                this.data.plan + '\nCCNumber: ' + 
                this.data['credit-card-number'] + '\nCCDate: ' + 
                this.data['credit-card-date'] + '\nCVC: ' + 
                this.data.cvc + '\nReferral: ' + 
                this.data.referral + '\nLicensed: ' + 
                this.data.licensed);
            return true;
        } else {
            alert('Form is not valid. Please fix the errors before submitting.');
        }
        return false;
    };

    Form.prototype.validateForm = function(event) {
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        this.validate = true;
        var blank = this.blankInputCheck();
        var dataValid = this.dataValidCheck();
        var license = this.licenseCheck();
        var dropdowns = this.dropdownCheck();
        if(blank&&dataValid&&dropdowns&&license) {
            document.getElementById('agent-form-second').style.display = 'block';
            this.ccInfoShow = true;
            document.getElementById('first-half-btn').style.display='none';
            this.referral.addEventListener('focusout', this.dropdownCheck.bind(this, 'referral'));
            return true;
        }
        return false;
    };

    // Initializing our event listeners
    Form.prototype.init = function() {
        var _this = this;
        for(var i=0; i<this.allInputs.length; i++){
            if(this.allInputs[i]!='submit-form')
            var el = this.allInputs[i];
            var id = this.allInputs[i].id;
            if(id!='licensed'){
                var inputField = document.getElementById(id);
                inputField.addEventListener('blur', this.blankInputCheck.bind(this, id));
                if(id=='email'||id=='password'||id=='mobile-number'){
                    inputField.addEventListener('blur', this.dataValidCheck.bind(this, id));
                }
            }
        }
        this.valBtn.addEventListener('click', this.validateForm.bind(_this));
        console.log(this.license);
        this.license.addEventListener('click', this.licenseCheck.bind(_this));
        this.prefix.addEventListener('focusout', this.dropdownCheck.bind(this, 'prefix'));
        this.plan.addEventListener('focusout', this.dropdownCheck.bind(this, 'plan'));
        this.submit.addEventListener('click', this.submitForm.bind(this));
    };

    // Creating an instance of the form
    var form = new Form();

    // Calling init() to initialize click events on the new form
    form.init();
});
