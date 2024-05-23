document.getElementById('submitButton').addEventListener('click', submitValue);

    async function submitValue(event) {
      event.preventDefault(); // Prevent default form submission

      const inputValue = document.getElementById('additionalInput').value;

        // Check if the input value is blank
    if (!inputValue.trim()) {
      alert('Input field cannot be blank');
      return;
  }

  // Show confirmation dialog
  const userConfirmed = window.confirm('Are you sure you want to submit the value?');

  if (!userConfirmed) {
      // User clicked "Cancel", abort the function
      return;
  }


    
      const projectID = document.getElementById('projectID2').value; // Get the projectID from the hidden input

      const response = await fetch('/submitDynamicTable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectID: projectID,
          inputValue: inputValue
        })
      });

      if (response.ok) {
        // Handle successful response
        alert('Value submitted successfully');
        window.location.href = '/thanks?projectID=' + encodeURIComponent(projectID);
      } else {
        // Handle error response
        const errorMessage = await response.text();
        console.error('Error submitting value:', errorMessage);
        alert('Error submitting value: ' + errorMessage);
      }
    }