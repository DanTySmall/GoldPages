<?php
	
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	
	$inData = getRequestInfo();
	
	$phoneNumber = $inData["phoneNumber"];
	$email = $inData["emailAddress"];
	$newFirstName = $inData["newFirstName"];
	$newLastName = $inData["newLastName"];
	$id = $inData["id"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=?");
		$stmt->bind_param("ssssi", $newFirstName, $newLastName, $phoneNumber, $email, $id);
		$stmt->execute();

		$stmt->close();
		$conn->close();
		returnWithError("");
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
