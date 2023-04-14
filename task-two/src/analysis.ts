import fs from 'fs';
import validator from 'email-validator';

async function analyseFiles(inputPaths: string[], outputPath: string) {
  try {
    const writableStream = fs.createWriteStream(outputPath);

    const streamData = fs.createReadStream(inputPaths[0]);
    console.log(streamData);
    let data = '';

    for await (const chunk of streamData as fs.ReadStream) {
      data += chunk;
      console.log(data);
    }

    interface Domain {
      [key: string]: number;
    }

    const validDomains: Domain = {};
    let validEmails: number = 0;

    const dataLines = data.trim().split('\n').slice(1);
    console.log(dataLines
      );
    
    // get valid emails
    const validEmailsData = dataLines.filter((email: string) =>
      validator.validate(email)
    );
  
    console.log(validEmailsData);

    let str = "tega@gmail.com";
    console.log(str.split("@"))

    for (const email of validEmailsData) {
      console.log(email);
      const Domain = email.split('@')[1];

console.log(Domain);

      if (!validDomains[Domain]) {
        validDomains[Domain] = 1;
      } else {
        validDomains[Domain] += 1;
      }
    }
    validEmails = validEmailsData.length;
    console.log(validEmails);

    const outputData = {
      'valid-domains': Object.keys(validDomains),
      totalEmailsParsed: dataLines.length,
      totalValidEmails: validEmails,
      categories: validDomains,
    };
    console.log(outputData);

    writableStream.write(JSON.stringify(outputData, null, 3) + "\n");
  } catch (err) {
    console.log(err);
  }
}
analyseFiles(['fixtures/inputs/small-sample.csv'], 'report-validation.csv')
export default analyseFiles;
