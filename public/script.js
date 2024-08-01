$(document).ready(function () {

    // Function to show a specific section
    window.showSection = function () {
        var sectionNumber = $('#sectionNumber').val();
        goto(sectionNumber);
    };
    var selectedStepNUmber = 1;
    // Function to go to a specific section
    window.goto = function (sectionNumber) {
        sectionNumber = parseInt(sectionNumber, 10);
        var isPrev = sectionNumber <= selectedStepNUmber;
        if ((validate() && !isPrev) || isPrev) {
            if (isNaN(sectionNumber) || sectionNumber < 1 || sectionNumber > 4) {
                alert('Please enter a valid section number (1-4)');
                return;
            }
            if(selectedStepNUmber === 2 && !checkPhone() && !isPrev){
                alert('Number format is wrong or the prefix chosen is not the correct one');
                return;
            }
            selectedStepNUmber = sectionNumber;

            $("fieldset").hide().animate({opacity: 0}, {duration: 100});
            $("fieldset").eq(sectionNumber - 1).show().animate({opacity: 2}, {duration: 400});
            updateProgress(sectionNumber - 1);
        }
        return;
    };

    // Function to update the progress bar
    function updateProgress(index) {
        $('#progressbar li').removeClass('active');
        $('#progressbar li').slice(0, index + 1).addClass('active');
        var percentage = ((index + 1) / $('#progressbar li').length) * 100;
        $('.pbar').css('width', percentage + '%');
    }


    /*-----------------validation-----------------*/
    // Custom method to validate username
    $.validator.addMethod("usernameRegex", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9]*$/i.test(value);
    }, "Username must contain only letters, numbers");

    function validate() {
        var form = $("#msform");
        form.validate({
            errorElement: 'span',
            errorClass: 'error-message',
            highlight: function (element, errorClass, validClass) {
                $(element).closest('input').addClass("error");
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).closest('input').removeClass("error");
            },
            rules: {
                firstName: {
                    required: true,

                    minlength: 2,
                },
                lastName: {
                    required: true,
                },
                email: {
                    required: true,
                    minlength: 3,
                },
                countryCode: {
                    required: true,
                },
                phone: {
                    required: true,
                },
                description:{
                    minlength:1,
                    required:true,
                },
                containers:{
                    required:true,
                },
                termsConditions:{
                    required:true,
                },
                signature:{
                    required:true,
                }

            },
            messages: {
                firstName: {
                    required: "First Name required",
                },
                lastName: {
                    required: "Last Name required",
                },
                email: {
                    required: "Email required",
                },
                countryCode: {
                    required: "Prefix required",
                },
                phone: {
                    regexp: "Wrong Format",
                    required: "Phone required",
                },
                description: {
                    required: "Not empty text area "
                },
                containers: {
                    required: "Slide to choose a number"
                },
                termsConditions: {
                    required: "Please Agree with our Terms and Conditions"
                },
                signature: {
                    required: "PLease Sign here"
                }
            }
        });
        return form.valid();
    };


    function isCanvasEmpty(canvas) {
        const context = canvas.getContext('2d');
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] !== 0) {
                return false;
            }
        }
        return true;
    }

    window.validateCanvasForm = function () {
        const canvas = document.getElementById('signature-pad');
        const errorMessage = document.getElementById('error-message');

        if (isCanvasEmpty(canvas)) {
            errorMessage.classList.remove('hidden');
            return false; // Prevent form submission
        } else {
            errorMessage.classList.add('hidden');
            return true; // Allow form submission
        }
    }

    function isFieldsetValid(fieldsetId, inp) {
        var $fieldset = $("#" + fieldsetId);
        return $fieldset.find(inp).val().trim() === "";
    }

    $('#msform').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        var formData = new FormData(this); // Create a FormData object from the form
        var padEl = $('#signature-pad')[0];
        // Check if the canvas element exists
        if (!padEl) {
            console.error('Canvas element not found.');
            return;
        }
        countries.forEach(country =>{
            if (country.code === formData.get('countryCode')){
                formData.append('countryPrefix',country.prefix);
            }
        })
        // var signature = signaturePad.toDataURL('image/png');
        formData.append('signature',padEl.toDataURL('image/png'));
        if (formData.get('telType') === 'Landline'){
            formData.set('allowSMSPolicies', 'NO');
        }

      if(isFieldsetValid("phoneTel", "#countryDropdown") || isFieldsetValid("phoneTel", "#phoneNumber") ) {
            console.log("phone not valid");
            goto(2);
            return;
        }
        if(isFieldsetValid("drop", "#desc") || isFieldsetValid("drop", "#rangeInput")) {
            console.log("drop not valid");
            goto(3);
            return;
        }
        // if (validate() ){
            if (validate()){
            $('#loader-container').show(); // Show the loader container
            $.ajax({
                url: 'https://webhook.site/c683380f-7463-4e1c-9999-cfab7d6ab18c',
                type: 'POST',
                data: formData,
                processData: false, // Prevent jQuery from automatically transforming the data into a query string
                contentType: false, // Set the content type to false so jQuery doesn't set it
                success: function (response) {
                    console.log('Success:', response); // Handle success
                    $('#sub').attr("disabled", "disabled");
                    document.getElementById("msform").reset();
                    window.location = "response.html";
                },
                error: function (xhr, status, error) {
                    alert("Error "+status+" : "+error)
                    console.error('Error:', error); // Handle error
                    document.getElementById("msform").reset();
                    $('#sub').attr("disabled", "disabled");
                    window.location = "response.html";
                },
                complete: function() {
                    $('#loader-container').hide(); // Hide the loader container
                }
            });

        }else {
            alert("Form is not valid. Fill all the data necessary")
        }
    });


    /*-------------------------phone---------*/

    const countries = [
        {code: 'us', name: 'United States', prefix: '+1'},
        {code: 'ca', name: 'Canada', prefix: '+1'},
        {code: 'gb', name: 'U. Kingdom', prefix: '+44'},
        {code: 'de', name: 'Germany', prefix: '+49'},
        {code: 'fr', name: 'France', prefix: '+33'},
        {code: 'al', name: 'Albania', prefix: '+355'}
        // Add more countries as needed
    ];

    const countryDropdown = $('#countryDropdown');
    const phoneNumberInput = $('#phoneNumber');
    const errorMessage = $('#errorMessage');

    countries.forEach(country => {
        const option = $('<option>', {
            value: country.code,
            textContent: country.prefix,
            'data-content': `<span class="flag-icon flag-icon-${country.code}"></span> ${country.name} (${country.prefix})`,

        });
        countryDropdown.append(option);
    });

    // Initialize the selectpicker
    countryDropdown.selectpicker();

    window.checkPhone = function () {

        const selectedCountry = countryDropdown.val();
        const phoneNumber = phoneNumberInput.val();

        if (!selectedCountry || !isValidPhoneNumber(phoneNumber, selectedCountry)) {
            errorMessage.show();
            return false;
        }else {
            errorMessage.hide();
            return true;
        }
    };

    function isValidPhoneNumber(number, country) {
        try {
            const phoneNumber = libphonenumber.parsePhoneNumber(number, country.toUpperCase());
            return phoneNumber.isValid();
        } catch (error) {
            return false;
        }
    }

    function updateValue() {
        var rangeInput = $('#rangeInput');
        var rangeValue = $('#rangeValue');
        rangeValue.text(rangeInput.val());

        var rangeWidth = rangeInput.width();
        var thumbWidth = 25; // Thumb width as defined in CSS
        var max = rangeInput.attr('max');
        var min = rangeInput.attr('min');
        var value = rangeInput.val();
        var left = ((value - min) / (max - min)) * (rangeWidth - thumbWidth) + (thumbWidth / 2);
        rangeValue.css('left', `${left}px`);

        rangeInput.css('--range-progress', `${(value - min) / (max - min) * 100}%`);
    }

    window.hideSMSRadio = function () {
        $('.sms').hide();
    }
    window.showSMSRadio = function () {
        $('.sms').show();
    }

    $('#rangeInput').on('input', updateValue);
    $(window).on('load', updateValue);
});
