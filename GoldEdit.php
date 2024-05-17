<?php
	$inData = getRequestInfo();
	
	$contactId = $inData["contactId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phoneNumber = $inData["phoneNumber"];
	$email = $inData["email"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "YourUsername", "YourPassword", "YourDatabaseName");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, PhoneNumber=?, Email=? WHERE ID=? AND UserId=?");
		$stmt->bind_param("ssssii", $firstName, $lastName, $phoneNumber, $email, $contactId, $userId);
		$stmt->execute();
		
		if ($stmt->affected_rows > 0) 
		{
			returnWithError("");
		} 
		else 
		{
			returnWithError("No Records Updated");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
?>