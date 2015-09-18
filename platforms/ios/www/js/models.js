function User(attributes) {
  this.attributes = attributes;

  this.login = function() {

  };
}

function Schedule(attributes) {
  this.attributes = attributes;

  this.save = function() {

  };
}

function Tenant(attributes) {
  this.attributes = attributes;
}

function Visit(v) {

  this.attributes = v;

  this.checkin = function() {
    if (this.attributes.state) {
      this.attributes.state = 'checked_in';
      AppService.checkInVisit({
        data: this
      }, function(data) {
        console.log(data);
      }, function(data, errorText) {
        alert('ERROR ' + data.status + ': ' + data.statusText);
      });
    }
  };
}

function Identification(attributes) {
  this.attributes = attributes;
}