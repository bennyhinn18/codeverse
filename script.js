class CodeVerse {
    constructor() {
        this.teams = [];
        this.currentRound = 1;
        this.maxRounds = 3;
        this.timer = null;
        this.timeLeft = 300; // 5 minutes in seconds
        this.roundTime = 5; // minutes
        this.eliminatedTeams = [];
        this.dares = [];
        this.currentDareIndex = 0;
        
        this.initializeEventListeners();
        this.showPage('landing-page');
    }

    initializeEventListeners() {
        // Landing page events
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showPage('registration-page');
        });

        document.getElementById('rules-btn').addEventListener('click', () => {
            document.getElementById('rules-modal').style.display = 'block';
        });

        // Modal events
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('rules-modal').style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('rules-modal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Registration events
        document.getElementById('save-teams-btn').addEventListener('click', () => {
            this.saveTeams();
        });

        // Game events
        document.getElementById('start-timer-btn').addEventListener('click', () => {
            this.startTimer();
        });

        document.getElementById('stop-timer-btn').addEventListener('click', () => {
            this.stopTimer();
        });

        document.getElementById('end-round-btn').addEventListener('click', () => {
            this.endRound();
        });

        document.getElementById('round-time').addEventListener('change', (e) => {
            this.roundTime = parseInt(e.target.value);
            this.timeLeft = this.roundTime * 60;
            this.updateTimerDisplay();
        });

        // Elimination events
        document.getElementById('assign-dare-btn').addEventListener('click', () => {
            this.assignDare();
        });

        document.getElementById('next-round-btn').addEventListener('click', () => {
            this.nextRound();
        });

        // Dare display events
        document.getElementById('dare-close-btn').addEventListener('click', () => {
            this.closeDareDisplay();
        });

        // Dare time events
        document.getElementById('dare-completed-btn').addEventListener('click', () => {
            this.markDareCompleted();
        });

        document.getElementById('next-dare-btn').addEventListener('click', () => {
            this.showNextDare();
        });

        document.getElementById('reveal-winner-btn').addEventListener('click', () => {
            this.showWinner();
        });

        // Winner events
        document.getElementById('restart-game-btn').addEventListener('click', () => {
            this.restartGame();
        });
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }

    saveTeams() {
        this.teams = [];
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach((card, index) => {
            const teamNumber = index + 1;
            const teamName = card.querySelector('h3').textContent;
            const memberInputs = card.querySelectorAll('.member-input');
            const members = [];
            
            memberInputs.forEach(input => {
                if (input.value.trim()) {
                    members.push({
                        name: input.value.trim(),
                        completed: false,
                        points: 0,
                        roundScore: 0
                    });
                }
            });
            
            if (members.length >= 3) { // Minimum 3 members required
                this.teams.push({
                    id: teamNumber,
                    name: teamName,
                    members: members,
                    totalPoints: 0,
                    eliminated: false,
                    eliminationRound: null,
                    dare: null
                });
            }
        });
        
        if (this.teams.length >= 2) {
            this.setupGameDashboard();
            this.showPage('game-page');
        } else {
            alert('Please ensure each team has at least 3 members!');
        }
    }

    setupGameDashboard() {
        document.getElementById('current-round').textContent = this.currentRound;
        this.updateTimerDisplay();
        this.renderTeams();
    }

    renderTeams() {
        const teamsGrid = document.getElementById('teams-grid');
        teamsGrid.innerHTML = '';
        
        this.teams.forEach(team => {
            if (!team.eliminated || this.shouldShowEliminatedTeam(team)) {
                const teamElement = this.createTeamElement(team);
                teamsGrid.appendChild(teamElement);
            }
        });
    }

    shouldShowEliminatedTeam(team) {
        // Show eliminated teams for reference in current round
        return team.eliminationRound === this.currentRound - 1;
    }

    createTeamElement(team) {
        const teamDiv = document.createElement('div');
        teamDiv.className = `team-dashboard ${team.eliminated ? 'eliminated' : ''}`;
        teamDiv.innerHTML = `
            <h3>${team.name}</h3>
            <div class="team-score">${team.totalPoints} pts</div>
            ${team.teamBonusThisRound > 0 ? `<div class="team-bonus">+${team.teamBonusThisRound} Team Bonus!</div>` : ''}
            <ul class="member-list">
                ${team.members.map((member, index) => `
                    <li class="member-item">
                        <span>${member.name} (${member.points} pts)</span>
                        <div class="member-score-info">
                            ${member.completed && member.roundScore > 0 ? `+${member.roundScore}` : ''}
                        </div>
                        <div class="member-controls">
                            <button class="complete-btn" onclick="codeVerse.toggleMemberCompletion(${team.id}, ${index}, true)" 
                                    ${member.completed ? 'style="background: #2e7d32;"' : ''}>
                                ✓
                            </button>
                            <button class="incomplete-btn" onclick="codeVerse.toggleMemberCompletion(${team.id}, ${index}, false)"
                                    ${!member.completed ? 'style="background: #c62828;"' : ''}>
                                ✗
                            </button>
                        </div>
                    </li>
                `).join('')}
            </ul>
            ${team.eliminated ? `<div style="color: #f44336; font-weight: bold;">ELIMINATED - Round ${team.eliminationRound}</div>` : ''}
            ${team.dare ? `<div style="color: #ff9800; margin-top: 10px;"><strong>Dare:</strong> ${team.dare}</div>` : ''}
        `;
        
        if (team.eliminated) {
            teamDiv.classList.add('slide-in');
        }
        
        return teamDiv;
    }

    toggleMemberCompletion(teamId, memberIndex, completed) {
        const team = this.teams.find(t => t.id === teamId);
        if (team && !team.eliminated) {
            team.members[memberIndex].completed = completed;
            
            // Update points based on completion and time
            if (completed) {
                // Calculate time-based score: max 50, reduce 5 every 30 seconds
                const timeElapsed = (this.roundTime * 60) - this.timeLeft;
                const thirtySecondIntervals = Math.floor(timeElapsed / 30);
                const roundScore = Math.max(5, 50 - (thirtySecondIntervals * 5)); // minimum 5 points
                
                // Add to existing points (cumulative scoring)
                team.members[memberIndex].roundScore = roundScore;
                team.members[memberIndex].points += roundScore;
            } else {
                team.members[memberIndex].roundScore = 0;
                // Don't subtract points, just don't add any for this round
            }
            
            this.updateTeamScore(team);
            this.renderTeams();
        }
    }

    updateTeamScore(team) {
        // Calculate total points from all members across all rounds
        team.totalPoints = team.members.reduce((total, member) => {
            return total + member.points;
        }, 0);
        
        // Bonus for team completion in current round
        const completedMembersThisRound = team.members.filter(m => m.completed).length;
        if (completedMembersThisRound === team.members.length) {
            const teamBonus = 100; // Team completion bonus
            team.totalPoints += teamBonus;
            
            // Track that team bonus was awarded this round
            team.teamBonusThisRound = teamBonus;
        } else {
            team.teamBonusThisRound = 0;
        }
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        document.getElementById('start-timer-btn').style.display = 'none';
        document.getElementById('stop-timer-btn').style.display = 'inline-flex';
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.showTimeUpAlert();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        document.getElementById('start-timer-btn').style.display = 'inline-flex';
        document.getElementById('stop-timer-btn').style.display = 'none';
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timerElement = document.getElementById('timer');
        timerElement.textContent = display;
        
        // Add warning colors
        timerElement.className = 'timer';
        if (this.timeLeft <= 60) {
            timerElement.classList.add('danger');
        } else if (this.timeLeft <= 120) {
            timerElement.classList.add('warning');
        }
    }

    showTimeUpAlert() {
        alert('⏰ Time\'s up! Please finish evaluating the current submissions.');
    }

    endRound() {
        this.stopTimer();
        
        // Calculate final scores for active teams
        this.teams.forEach(team => {
            if (!team.eliminated) {
                this.updateTeamScore(team);
            }
        });
        
        const activeTeams = this.teams.filter(t => !t.eliminated);
        
        if (activeTeams.length <= 1) {
            // This shouldn't happen, but just in case
            this.showWinner();
            return;
        }
        
        // Check if this is the final round (2 teams remaining)
        if (activeTeams.length === 2) {
            // Final round - eliminate the loser and assign them a dare too
            const lowestScore = Math.min(...activeTeams.map(t => t.totalPoints));
            const eliminatedTeam = activeTeams.find(t => t.totalPoints === lowestScore);
            
            if (eliminatedTeam) {
                eliminatedTeam.eliminated = true;
                eliminatedTeam.eliminationRound = this.currentRound;
                this.showEliminationScreen(eliminatedTeam, true); // true indicates final round
            } else {
                this.showWinner();
            }
            return;
        }
        
        if (this.currentRound >= this.maxRounds) {
            this.showWinner();
            return;
        }
        
        // Find team with lowest score for elimination
        const lowestScore = Math.min(...activeTeams.map(t => t.totalPoints));
        const eliminatedTeam = activeTeams.find(t => t.totalPoints === lowestScore);
        
        if (eliminatedTeam) {
            eliminatedTeam.eliminated = true;
            eliminatedTeam.eliminationRound = this.currentRound;
            this.showEliminationScreen(eliminatedTeam, false); // false indicates not final round
        } else {
            this.nextRound();
        }
    }

    showEliminationScreen(eliminatedTeam, isFinalRound = false) {
        const eliminatedTeamDiv = document.getElementById('eliminated-team');
        eliminatedTeamDiv.innerHTML = `
            <h3>${eliminatedTeam.name}</h3>
            <p>Final Score: ${eliminatedTeam.totalPoints} points</p>
            <div class="member-summary">
                <h4>Team Members:</h4>
                <ul>
                    ${eliminatedTeam.members.map(member => `
                        <li>${member.name} - ${member.completed ? '✅ Completed' : '❌ Incomplete'} 
                        ${member.roundScore > 0 ? `(+${member.roundScore} this round)` : ''} 
                        [Total: ${member.points} pts]</li>
                    `).join('')}
                </ul>
                ${eliminatedTeam.teamBonusThisRound > 0 ? `<p style="color: #ffd700;">🏆 Team Completion Bonus: +${eliminatedTeam.teamBonusThisRound} points</p>` : ''}
            </div>
            ${isFinalRound ? '<p style="color: #ffd700; font-weight: bold;">🏆 Final Round Elimination 🏆</p>' : ''}
        `;
        
        document.getElementById('dare-input').value = '';
        const nextRoundBtn = document.getElementById('next-round-btn');
        
        if (isFinalRound) {
            nextRoundBtn.innerHTML = '<i class="fas fa-theater-masks"></i> Start Dare Time!';
            nextRoundBtn.onclick = () => this.startDareSequence();
        } else {
            nextRoundBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Continue to Next Round';
            nextRoundBtn.onclick = () => this.nextRound();
        }
        
        nextRoundBtn.style.display = 'none';
        this.showPage('elimination-page');
    }

    assignDare() {
        const dareText = document.getElementById('dare-input').value.trim();
        if (!dareText) {
            alert('Please enter a dare for the eliminated team!');
            return;
        }
        
        const lastEliminatedTeam = this.teams.find(t => 
            t.eliminated && t.eliminationRound === this.currentRound
        );
        
        if (lastEliminatedTeam) {
            lastEliminatedTeam.dare = dareText;
            this.dares.push({
                team: lastEliminatedTeam.name,
                dare: dareText,
                round: this.currentRound
            });
            
            // Show the dare display box
            this.showDareDisplay(lastEliminatedTeam.name, dareText);
        }
        
        document.getElementById('next-round-btn').style.display = 'inline-flex';
        document.getElementById('assign-dare-btn').innerHTML = '<i class="fas fa-check"></i> Dare Assigned!';
        document.getElementById('assign-dare-btn').disabled = true;
    }

    showDareDisplay(teamName, dareText) {
        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'dare-backdrop';
        backdrop.id = 'dare-backdrop';
        document.body.appendChild(backdrop);
        
        // Show the dare display box
        const dareBox = document.getElementById('dare-display-box');
        const dareTextElement = document.getElementById('dare-display-text');
        const dareTeamElement = document.getElementById('dare-team-info');
        
        dareTextElement.textContent = dareText;
        dareTeamElement.textContent = `Challenge for: ${teamName}`;
        
        dareBox.style.display = 'block';
        
        // Add click outside to close
        backdrop.addEventListener('click', () => {
            this.closeDareDisplay();
        });
    }

    closeDareDisplay() {
        const dareBox = document.getElementById('dare-display-box');
        const backdrop = document.getElementById('dare-backdrop');
        
        if (dareBox) {
            dareBox.style.animation = 'darePopOut 0.4s ease-in forwards';
            setTimeout(() => {
                dareBox.style.display = 'none';
                dareBox.style.animation = '';
            }, 400);
        }
        
        if (backdrop) {
            backdrop.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                backdrop.remove();
            }, 300);
        }
    }

    nextRound() {
        this.currentRound++;
        this.timeLeft = this.roundTime * 60;
        
        // Reset member completion status for new round but keep cumulative points
        this.teams.forEach(team => {
            if (!team.eliminated) {
                team.members.forEach(member => {
                    member.completed = false;
                    member.roundScore = 0; // Reset round score for new round
                    // Keep member.points (cumulative score)
                });
                team.teamBonusThisRound = 0; // Reset team bonus flag
            }
        });
        
        document.getElementById('assign-dare-btn').innerHTML = '<i class="fas fa-magic"></i> Assign Dare';
        document.getElementById('assign-dare-btn').disabled = false;
        
        this.setupGameDashboard();
        this.showPage('game-page');
    }

    showWinner() {
        const activeTeams = this.teams.filter(t => !t.eliminated);
        let winner;
        
        if (activeTeams.length === 1) {
            winner = activeTeams[0];
        } else {
            // Find team with highest score
            const highestScore = Math.max(...activeTeams.map(t => t.totalPoints));
            winner = activeTeams.find(t => t.totalPoints === highestScore);
        }
        
        const winningTeamDiv = document.getElementById('winning-team');
        winningTeamDiv.innerHTML = `
            <h2>${winner.name}</h2>
            <div class="final-score">Champion Score: ${winner.totalPoints} points</div>
            <div class="winning-members">
                <h3>🏆 Coding Legends 🏆</h3>
                <ul>
                    ${winner.members.map(member => `
                        <li class="winner-member">${member.name} - The Code Converter</li>
                    `).join('')}
                </ul>
            </div>
            <div class="achievement">
                <p>"These legends successfully conquered the art of code translation!"</p>
                <p>"From C to Python and Python to C - True CodeVerse Champions!"</p>
            </div>
        `;
        
        // Show dare summary for eliminated teams
        if (this.dares.length > 0) {
            const dareSection = document.createElement('div');
            dareSection.className = 'dare-summary';
            dareSection.innerHTML = `
                <h3>🎭 Dare Performances</h3>
                <p>Time for the eliminated teams to showcase their dares!</p>
                <div class="dare-list">
                    ${this.dares.map((dare, index) => `
                        <div class="dare-item">
                            <strong>${dare.team}</strong> (Round ${dare.round}): ${dare.dare}
                        </div>
                    `).join('')}
                </div>
            `;
            winningTeamDiv.appendChild(dareSection);
        }
        
        this.showPage('winner-page');
        this.triggerConfetti();
    }

    triggerConfetti() {
        const confetti = document.querySelector('.confetti');
        confetti.style.display = 'block';
        
        // Create additional confetti elements
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const newConfetti = confetti.cloneNode(true);
                confetti.parentNode.appendChild(newConfetti);
                
                setTimeout(() => {
                    newConfetti.remove();
                }, 3000);
            }, i * 1000);
        }
    }

    restartGame() {
        this.teams = [];
        this.currentRound = 1;
        this.timeLeft = 300;
        this.eliminatedTeams = [];
        this.dares = [];
        this.currentDareIndex = 0;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Clear all inputs
        document.querySelectorAll('.member-input').forEach(input => {
            input.value = '';
        });
        
        this.showPage('landing-page');
    }

    startDareSequence() {
        this.currentDareIndex = 0;
        this.showPage('dare-time-page');
        this.showCurrentDare();
    }

    showCurrentDare() {
        if (this.currentDareIndex >= this.dares.length) {
            // All dares completed, show reveal section
            this.showRevealSection();
            return;
        }

        const currentDare = this.dares[this.currentDareIndex];
        document.getElementById('dare-team-name').textContent = currentDare.team;
        document.getElementById('dare-challenge').textContent = currentDare.dare;
        
        // Hide completion box and reveal section
        document.getElementById('dare-completion-box').style.display = 'none';
        document.getElementById('reveal-section').style.display = 'none';
        
        // Show dare controls
        document.getElementById('dare-completed-btn').style.display = 'inline-flex';
    }

    markDareCompleted() {
        const currentDare = this.dares[this.currentDareIndex];
        const messages = [
            "🎉 Fantastic performance! You've shown true courage and sportsmanship!",
            "👏 Brilliant execution! That was entertaining and brave!",
            "🌟 Amazing job! You've turned elimination into entertainment!",
            "🎭 What a show! You've proven that coding spirit extends beyond just code!",
            "💪 Outstanding! You've demonstrated real team spirit!"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById('completion-message').textContent = randomMessage;
        
        // Hide dare controls
        document.getElementById('dare-completed-btn').style.display = 'none';
        
        // Show completion box
        const completionBox = document.getElementById('dare-completion-box');
        completionBox.style.display = 'block';
        
        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'dare-backdrop';
        backdrop.id = 'completion-backdrop';
        document.body.appendChild(backdrop);
    }

    showNextDare() {
        // Close completion box
        document.getElementById('dare-completion-box').style.display = 'none';
        const backdrop = document.getElementById('completion-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        
        this.currentDareIndex++;
        this.showCurrentDare();
    }

    showRevealSection() {
        document.getElementById('current-dare-display').style.display = 'none';
        document.getElementById('dare-completed-btn').style.display = 'none';
        document.getElementById('reveal-section').style.display = 'block';
    }

    // Utility methods for debugging and manual control
    simulateRoundCompletion(teamId, completionRate = 0.8) {
        const team = this.teams.find(t => t.id === teamId);
        if (team && !team.eliminated) {
            const membersToComplete = Math.floor(team.members.length * completionRate);
            for (let i = 0; i < membersToComplete; i++) {
                team.members[i].completed = true;
                team.members[i].points = 100 + Math.floor(Math.random() * 100);
            }
            this.updateTeamScore(team);
            this.renderTeams();
        }
    }

    exportGameData() {
        const gameData = {
            teams: this.teams,
            currentRound: this.currentRound,
            dares: this.dares,
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(gameData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `codeverse-game-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
}

// Initialize the game
const codeVerse = new CodeVerse();

// Expose some methods globally for easy testing
window.codeVerse = codeVerse;

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'S' to start/stop timer
    if (e.key.toLowerCase() === 's' && e.ctrlKey) {
        e.preventDefault();
        const startBtn = document.getElementById('start-timer-btn');
        const stopBtn = document.getElementById('stop-timer-btn');
        
        if (startBtn.style.display !== 'none') {
            codeVerse.startTimer();
        } else {
            codeVerse.stopTimer();
        }
    }
    
    // Press 'E' to end round
    if (e.key.toLowerCase() === 'e' && e.ctrlKey) {
        e.preventDefault();
        const endBtn = document.getElementById('end-round-btn');
        if (endBtn && endBtn.offsetParent !== null) {
            codeVerse.endRound();
        }
    }
});

// Add demo data functionality for testing
function loadDemoData() {
    const demoTeams = [
        {
            name: 'Team Alpha',
            members: ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Wilson']
        },
        {
            name: 'Team Beta', 
            members: ['Frank Miller', 'Grace Lee', 'Henry Davis', 'Ivy Chen', 'Jack Robinson']
        },
        {
            name: 'Team Gamma',
            members: ['Kelly Green', 'Liam Taylor', 'Maya Patel', 'Noah Kim', 'Olivia Martinez']
        },
        {
            name: 'Team Delta',
            members: ['Paul Anderson', 'Quinn O\'Brien', 'Riley Santos', 'Sam Thompson', 'Tara Singh']
        }
    ];
    
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach((card, index) => {
        if (demoTeams[index]) {
            const inputs = card.querySelectorAll('.member-input');
            demoTeams[index].members.forEach((member, memberIndex) => {
                if (inputs[memberIndex]) {
                    inputs[memberIndex].value = member;
                }
            });
        }
    });
    
    console.log('Demo data loaded! Click "Save Teams & Start Competition" to begin.');
}

// Make loadDemoData available globally for testing
window.loadDemoData = loadDemoData;

console.log('🚀 CodeVerse initialized!');
console.log('💡 Pro tips:');
console.log('   • Use loadDemoData() to quickly fill in test teams');
console.log('   • Use Ctrl+S to start/stop timer');
console.log('   • Use Ctrl+E to end current round');
console.log('   • Use codeVerse.exportGameData() to save game results');
