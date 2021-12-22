# Riemann Sums Visualization
![Screenshot](https://i.imgur.com/voWh8Qe.png)

### Controls
Use the slider to change n and click the values above the graph to toggle Left, Right, and Trapezoidal sums. Open the menu by clicking the icon in the bottom right or by pressing space. You can:
- Enter a custom f(x) [see math.js docs for all supported functions]
- Set the bounds for the graph window / interval
- Set the grid cell size (ticks)
- Set a new max value for n, where n is the # of subintervals 

### To-do:
- [x] padding around graph
- [x] midpoint sum
- [x] variable function
- [x] simple UI controls, scaling text
- [x] could use noloop(), only redraw on slider change?
- [x] separate grid lines and labels (lines behind, labels in front)
- [x] readme.md
- [x] handle prompt cancel
- [x] autoscale on window resize
- [x] check for e and pi in entered bounds
- [x] fix exta // missing (?) point bug
- [x] change bound entry to signed values, allow for [+a, +b] and [-a, -b]
- [x] rename xRange/yRange to domain/range
- [x] add buttons for changing tick #, type, n, and function
- [x] draw labels inside of graph view
- [x] validation for bounds and f(x) input
- [x] display active function
- [x] menu entries shouldn't close menu when prompt is canceled (see bounds)
- [x] rewrite hastily crafted button class (pls)
- [x] floating point precision (small #s) [detect magnitude on bound entry?]
- [ ] sum buttons should be pushed to left, with a standard space inbetween
- [ ] dolan suggestions
- [ ] implement own text entry / dialog for f(x) prompt
- [ ] 'usable' on mobile
- [ ] line length...
