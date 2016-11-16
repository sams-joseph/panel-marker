class Logging {
    constructor(jobNumber, operator, error) {
        this.jobNumber = jobNumber;
        this.operator = operator;
        this.error = error;
    }

    logger() {
        var currentdate = new Date();
        var datetime = currentdate.getDate() + '/'
                        + (currentdate.getMonth()+1)  + '/'
                        + currentdate.getFullYear() + ' @ '
                        + currentdate.getHours() + ':'
                        + currentdate.getMinutes() + ':'
                        + currentdate.getSeconds();

          var filepath = `G33STORE-1/4_Joe/scripts/_logs/cinemark/${this.jobNumber}.txt`;
          var write_file = File(filepath);

          if (!write_file.exists) {
            write_file = new File(filepath);
                  var out;
              if (write_file !== '') {
                out = write_file.open('w', undefined, undefined);
                write_file.encoding = "UTF-8";
                write_file.lineFeed = "Macintosh";
              }
              if (out !== false) {
                write_file.writeln(`${this.operator} worked ${this.jobNumber} at ${datetime}\nAny Errors: ${this.error}\n`);
                write_file.close();
              }
          } else {
            var append_file = File(filepath);
              append_file.open('a', undefined, undefined);
              if (append_file !== '') {
                append_file.writeln(`${this.operator} worked ${this.jobNumber} at ${datetime}\nAny Errors: ${this.error}\n`);
              append_file.close();
            }
          }
      }
}

export default Logging;
