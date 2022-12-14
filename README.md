## Performance testing of [lifecharger](https://lifecharger.eu/)

demo website : [lifecharger](https://lifecharger.eu/)
- https://lifecharger.eu/

### Steps of creating JMeter test
- Start JMeter
- Test plan creation
- Thread group
- Sampler(http)
- Listener
- Run
### Steps of BlazeMeter test
- Go to [lifecharger](https://lifecharger.eu/) website
- open BlazeMeter extension
- start recording
- goto Home, Contact, Blog, About tab
- reload and BlazeMeter record will be saved
- BlazeMeter report will generate automatically
- go to JMeter with the file
- make report with command line

### Steps of creating thread properties
- 1,00000 users will use this website within 12 hours
- So total users 1,00000 and total time - 12*60*60 = 43,200 second
- now number of threads(users) - 1,00000 / 43,200 = 2.31 per second
- in 2 seconds it will be 4.63 users
- so I fixed it as 5 users in 2 seconds
- with 1 loop count
- But in our test plan number of users - 1
- numbers of second is - 1
- number of loop count - 1

### Some GUI report elements
- View Results Tree
- Summary Report
- Aggregate Report
### Some Assertions
- Response assertions
- Duration assertions
- Size assertions

### Final Test Report
I’ve completed performance test on frequently used API for [lifecharger](https://lifecharger.eu/).

- Concurrent Request - 71
- Total transactions -  12.23
- Avg TPS for Total Samples - 0.48
- Total Concurrent API requested - 71
- Average time - 1995.48 milliseconds
- error rate is 0%
### Live site of the report

https://tangerine-puffpuff-261237.netlify.app/index.html





