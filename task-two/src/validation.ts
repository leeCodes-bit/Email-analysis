/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import fs from 'fs';
import validator from 'email-validator';
import { promises as dns } from 'dns';

// Make validateEmailAddresses an asynchronous function ...
async function validateEmailAddresses(
  inputPaths: string[],
  outputPath: string,
): Promise<void> {
  const readableStream = fs.createReadStream(inputPaths[0], 'utf8');
  const writableStream = fs.createWriteStream(outputPath);

  // Create interface for statusObj ...
  interface statusObj {
    [key: string]: boolean | undefined;
  }

  // Check for email status and validate them ...
  const domainsStatus: statusObj = {};
  const validEmails: string[] = [];

  writableStream.write('Email \n');

  readableStream.on('data', async (data) => {

    console.log(data);
    const emails = data.trim().split('\n');
    console.log(emails);
    console.log(`${emails.length} emails taken in to be validated`);
    try {
      let count = 0;
      for (const email of emails) {
        if (validator.validate(email)) {
          const domainName = email.split('@')[1];
          console.log(domainName);

          if (domainsStatus[domainName] === false) {
            validEmails.push(email);
            if (domainsStatus[domainName]){ 
              writableStream.write(email + '\n')
             };
            console.log(`${validEmails.length} valid emails found`);
            continue;
          }
          console.log(domainName);

          // Looks up mail exchange records for the domain ...
          const resolveObj = await dns
            .resolveMx(domainName)
            .then(() => {
              return true;
            })
            .catch((err) => {
              if (err.code === 'ENODATA') return false;
            });
          if (resolveObj) {
            writableStream.write(email + '\n');
            validEmails.push(email);
            domainsStatus[domainName] = resolveObj;
            console.log(domainsStatus[domainName]);
          }
          if (resolveObj === false) domainsStatus[domainName] = resolveObj;
          count++;
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
  readableStream.on('close', () => {
    console.log('Completed');
  });
}
 validateEmailAddresses(['fixtures/inputs/small-sample.csv'], 'report-validation.csv')
export default validateEmailAddresses;
