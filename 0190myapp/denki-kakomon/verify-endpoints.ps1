$qualifications = @(
    "A1", "A2", 
    "B1", "B2", 
    "C1", "C2", "C3", 
    "D1", "D2", "D3", 
    "E1", "E2", 
    "F3", "F5"
)
$baseUrl = "http://localhost:3000"

Write-Host "Verifying qualifications endpoints..."

$results = @()
foreach ($id in $qualifications) {
    try {
        $detailUrl = "$baseUrl/$id"
        $practiceUrl = "$baseUrl/practice/$id"
        
        $detailResp = Invoke-WebRequest -Uri $detailUrl -Method Head -UseBasicParsing -ErrorAction Stop
        $practiceResp = Invoke-WebRequest -Uri $practiceUrl -Method Head -UseBasicParsing -ErrorAction Stop
        
        $results += [PSCustomObject]@{
            ID       = $id
            Detail   = $detailResp.StatusCode
            Practice = $practiceResp.StatusCode
            Status   = "OK"
        }
    }
    catch {
        $results += [PSCustomObject]@{
            ID       = $id
            Detail   = $_.Exception.Response.StatusCode
            Practice = "N/A"
            Status   = "ERROR"
        }
    }
}

$results | Format-Table -AutoSize
