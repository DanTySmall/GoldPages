<?php

	$inData = getRequestInfo();
	
	$search = "%" . $inData["search"] . "%";
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "Root1Password", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT FirstName, LastName, PhoneNumber, Email FROM Contacts WHERE UserId=? AND (FirstName LIKE ? OR LastName LIKE ? OR PhoneNumber LIKE ? OR Email LIKE ?)");
		$stmt->bind_param("issss", $userId, $search, $search, $search, $search);
		$stmt->execute();
		$result = $stmt->get_result();

		$searchResults = "";
		$searchCount = 0;
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"firstName":"' . $row["FirstName"] . '","lastName":"' . $row["LastName"] . '","phoneNumber":"' . $row["PhoneNumber"] . '","email":"' . $row["Email"] . '"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>