document.getElementById('submitButton').addEventListener('click', submitValue);

    async function submitValue(event) {
      event.preventDefault(); // Prevent default form submission
      const inputValue = document.getElementById('additionalInput').value;
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
        // Optionally, refresh the page or update the table dynamically
        location.reload();
      } else {
        // Handle error response
        const errorMessage = await response.text();
        console.error('Error submitting value:', errorMessage);
        alert('Error submitting value: ' + errorMessage);
      }
    }