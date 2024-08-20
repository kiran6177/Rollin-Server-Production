export const getHtmlContent = (data,theatreName)=>{
    const screenData = data[0][1]
    let screensHtml = '';
    let content = '';

    for(let screen of screenData){
        screensHtml += `<th style="border: 1px solid black; padding: 1rem;">${screen?.screen}</th>`
    }

    for(let obj of data){
        let data = `<tr >`
        data += `<td style="text-align: center; border: 1px solid black; padding: 0.5rem;">${obj[0]}</td>`
        for(let each of obj[1]){
            data += `<td style="text-align: center; border: 1px solid black; padding: 0.5rem;">${each?.totalAmount}</td>`
        }        
        data += '</tr>'
        content += data
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body style="display: flex; flex-direction: column; align-items: center; width: 100vw; min-height: 80vh;">
        <h2 style="margin-top: 3.5rem;">RollIN Screen Collection Report</h2>
        <h2 style="margin: 2.5rem 0px;">${theatreName}</h2>
        <table style="width: 80%; border-spacing: 0; border-collapse: collapse;">
            <tr >
                <th style="border: 1px solid black; padding: 1rem;">Date</th>
                ${screensHtml}
            </tr>
            ${content}
        </table>
    </body>
    </html>`
    return htmlContent
}