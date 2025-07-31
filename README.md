# 🚀 CodeVerse - The Ultimate Coding Battle Arena

A web application designed for managing exciting coding competitions where teams convert code between C and Python programming languages.

## 🎯 Event Overview

**CodeVerse** is perfect for technical events where:
- Teams compete to convert code snippets between C and Python
- Multiple rounds with elimination system
- Dare challenges for eliminated teams
- Epic winner celebrations with Kit Kat prizes! 🍫

## 🛠️ Setup Instructions

### Quick Start
1. Open `index.html` in any modern web browser
2. Click "Start Battle" to begin registration
3. Register your teams (4 teams recommended, 5-6 members each)
4. Start competing!

### For Event Organizers

#### Pre-Event Setup
1. **Prepare Code Snippets**: Create different code snippets in both C and Python
2. **Team Formation**: Organize participants into teams of 5-6 members
3. **Hardware**: Ensure you have a projection screen/large display
4. **Prizes**: Get those Kit Kat chocolates ready! 🍫

#### During the Event
1. **Registration**: Use the registration page to enter all team members
2. **Round Management**: 
   - Set timer duration (default 5 minutes)
   - Track member completion status
   - Award points based on completion and time
3. **Elimination**: Lowest-scoring team gets eliminated each round
4. **Dares**: Enter custom dare challenges for eliminated teams
5. **Victory**: Epic full-screen winner celebration

## 🎮 Features

### 🏠 Landing Page
- Animated game title with glowing effects
- Rules modal with complete event guidelines
- Starfield background animation

### 📝 Team Registration
- Support for 4 teams with 5-6 members each
- Clean, intuitive input interface
- Validation to ensure minimum team sizes

### 🎯 Game Dashboard
- Real-time timer with visual warnings
- Individual member completion tracking
- Live score calculations
- Team elimination animations
- Customizable round duration

### 🦆 Elimination Screen
- "Hall of Shame" with dramatic animations
- Custom dare assignment system
- Smooth transitions between rounds

### 🏆 Winner Celebration
- Full-screen victory animation
- Confetti effects
- Kit Kat celebration theme
- Complete game summary

## 🎮 Controls & Shortcuts

### Mouse Controls
- **Start/Stop Timer**: Click the timer buttons
- **Member Completion**: Click ✓ or ✗ buttons for each member
- **End Round**: Click "End Round" when evaluation is complete

### Keyboard Shortcuts
- **Ctrl + S**: Start/Stop timer
- **Ctrl + E**: End current round

### Debug Functions (Press F12 for console)
- `loadDemoData()`: Fill in test team data
- `codeVerse.exportGameData()`: Export game results as JSON
- `codeVerse.simulateRoundCompletion(teamId, rate)`: Simulate team completion

## 🏁 Event Flow

### Round Structure
1. **Setup**: Distribute code snippets to team members
2. **Start Timer**: Begin 5-minute conversion period
3. **Evaluation**: Mark completed conversions using the interface
4. **Scoring**: Points awarded based on completion + time bonus
5. **Elimination**: Lowest-scoring team eliminated
6. **Dare Assignment**: Enter dare challenge for eliminated team

### Scoring System
- **Base Points**: 100 points per completed conversion
- **Time Bonus**: Remaining seconds added as bonus points
- **Team Completion Bonus**: 200 extra points if entire team completes
- **Final Score**: Sum of all member points + bonuses

### Round Progression
- **Round 1**: 4 teams → 3 teams (1 eliminated)
- **Round 2**: 3 teams → 2 teams (1 eliminated)  
- **Round 3**: 2 teams → 1 winner (1 eliminated)

## 🎭 Dare Ideas for Eliminated Teams

Need inspiration for dares? Here are some fun, coding-themed suggestions:

### Technical Dares
- Write "Hello World" in 5 different programming languages on the whiteboard
- Explain a complex algorithm using only hand gestures
- Code a simple function while blindfolded (with teammate guidance)

### Performance Dares
- Sing the attributes of a programming language as a song
- Act out the lifecycle of a software bug
- Perform a dramatic reading of code comments

### Creative Dares
- Draw a flowchart of making breakfast
- Write a haiku about their favorite programming language
- Create a human representation of a sorting algorithm

## 🔧 Customization

### Changing Team Names
Edit the team names in `index.html` around line 90-130:
```html
<h3>Team Alpha</h3>  <!-- Change to your preferred names -->
```

### Adjusting Timer
Default is 5 minutes, but can be changed:
- In the interface: Use the "Round Time" input
- In code: Modify `this.roundTime = 5` in `script.js`

### Styling
Customize colors and animations in `styles.css`:
- Main theme colors: Lines 20-30
- Animation speeds: Search for `@keyframes`
- Team card styling: Lines 200-250

## 🚀 Technical Requirements

### Browser Compatibility
- **Recommended**: Chrome, Firefox, Safari, Edge (latest versions)
- **Features Used**: CSS Grid, Flexbox, ES6+ JavaScript
- **Responsive**: Works on tablets and mobile devices

### Performance
- **Lightweight**: No external dependencies except Google Fonts
- **Offline Ready**: Can run without internet connection
- **Fast Loading**: Optimized CSS and JavaScript

## 🎉 Tips for Event Success

### Before the Event
1. **Test Run**: Do a complete test with dummy data
2. **Backup Plan**: Have printed score sheets as backup
3. **Screen Setup**: Test projection/display setup
4. **Code Prep**: Prepare varied difficulty levels of code snippets

### During the Event
1. **Energy Management**: Keep the atmosphere exciting with music
2. **Fair Play**: Ensure equal difficulty of code snippets
3. **Time Management**: Stick to the schedule but allow flexibility
4. **Documentation**: Take photos/videos for memories!

### After the Event
1. **Export Data**: Use `codeVerse.exportGameData()` to save results
2. **Feedback**: Gather participant feedback for future events
3. **Celebration**: Don't forget the Kit Kat ceremony! 🍫

## 🐛 Troubleshooting

### Common Issues
- **Timer not starting**: Check console for errors, refresh page
- **Teams not saving**: Ensure minimum 3 members per team
- **Animations not working**: Check browser compatibility

### Debug Mode
Open browser console (F12) for detailed logging and debug functions.

## 📄 License

This project is open source and free to use for educational and non-commercial events.

---

**Built with ❤️ for coding enthusiasts everywhere!**

*May your code compile cleanly and your bugs be few!* 🐛✨
