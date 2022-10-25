const storage = chrome.storage.local;
let entity = {};

function showBaseEmail() {
  storage.get(function(items) {
    const baseEmail = items.baseEmail;
    if (baseEmail) {
      document.getElementById("i-base-email").value = baseEmail;
    } else {
      document.getElementById("i-base-email").innerHTML = "No base email found";
    }
  });
};

function updateBaseEmail() {
  const email = document.getElementById('i-base-email');
  entity = {
    baseEmail: email.value
  };
  storage.set(entity, function() {
    console.log('stored baseEmail');
    showBaseEmail();
  });
};

function getCurrent() {
  const padding = '00';
  const date = new Date;
  const year = date.getFullYear().toString().slice(-2);
  const month = (padding + (date.getMonth() + 1)).slice(-2);
  const day = (padding + date.getDate()).slice(-2);
  const hours = (padding + date.getHours()).slice(-2);
  const minutes = (padding + date.getMinutes()).slice(-2);
  const seconds = (padding + date.getSeconds()).slice(-2);
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function generate() {
  storage.get(function(items) {
    if(!items.baseEmail) return alert('No base email found');
    const emails = !!items.emails ? items.emails.slice(0,9) : [];
    const baseEmail = items.baseEmail.split('@');
    let newEmail = `${baseEmail[0]}+${getCurrent()}@${baseEmail[1]}`;

    if(emails.includes(newEmail)) return

    emails.push(newEmail);

    entity = {
      emails
    };
    storage.set(entity, function() {
      console.log('stored emails');
      showCurrentEmail();
      addEmail(document.getElementById('emails-list'), newEmail);
    });
  });
}

function showCurrentEmail() {
  storage.get(function(items) {
    const emails = items.emails;
    if (emails && emails.length > 0) {
      document.getElementById("current-email").innerHTML = emails.slice(-1);
    } else {
      document.getElementById("current-email").innerHTML = "No current email found";
    }
  });
};

function copyCurrentEmail() {
  storage.get(function(items) {
    const emails = items.emails;
    if (emails && emails.length > 0) {
      const email = emails.slice(-1);
      navigator.clipboard.writeText(email);
    }
  });
};

function addEmail(emailsList, email) {
  const emailsListItem = document.createElement('div');
  emailsListItem.className = 'emails-list-item';
  const emailTextCellLeft = document.createElement('div');
  emailTextCellLeft.className = 'email-text-cell';
  const emailText = document.createTextNode(email);
  emailTextCellLeft.appendChild(emailText);
  const emailTextCellRight = document.createElement('div');
  emailTextCellRight.className = 'email-text-cell';
  const copyBtnEl = document.createElement('button');
  emailTextCellRight.appendChild(copyBtnEl);
  copyBtnEl.innerHTML = 'Copy';
  copyBtnEl.className = 'copy-btn popup-btn';
  copyBtnEl.addEventListener('click', function() {
    navigator.clipboard.writeText(email);
    copyBtnEl.classList.add('copied');
    setTimeout(function() {
      copyBtnEl.classList.remove('copied');
    }, 1500);
  });
  emailsListItem.appendChild(emailTextCellLeft);
  emailsListItem.appendChild(emailTextCellRight);
  emailsList.prepend(emailsListItem);
};

function showEmailsList() {
  const emailsList = document.getElementById('emails-list');
  storage.get(function(items) {
    const emails = items.emails;
    if (emails && emails.length > 0) {
      emails.forEach(function(email) {
        addEmail(emailsList, email);
      });
    }
  });
};

document.addEventListener('DOMContentLoaded', function() {
  showCurrentEmail();
  showBaseEmail();
  showEmailsList();

  const generateBtn = document.getElementById('generate-email');
  const copyCurrentEamilBtn = document.getElementById('copy-email');
  const baseEmailBtn = document.getElementById('i-base-email-btn');


  generateBtn.addEventListener('click', function() {
    console.log('clicked generateBtn');
    generate();
  });

  copyCurrentEamilBtn.addEventListener('click', function() {
    console.log('clicked copyBtn');
    copyCurrentEmail();
    copyCurrentEamilBtn.classList.add('current-email-copied');
    setTimeout(function() {
      copyCurrentEamilBtn.classList.remove('current-email-copied');
    }, 1500);
  });

  baseEmailBtn.addEventListener('click', function() {
    console.log('clicked baseEmailBtn');
    updateBaseEmail();
  });
});
