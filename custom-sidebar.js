// Custom Sidebar Navigation for Swagger UI
(function() {
    'use strict';
    
    console.log("Custom sidebar script loaded");
    
    let initializationAttempts = 0;
    const maxAttempts = 50;
    
    // Controller configuration
    const controllerConfig = {
        all: {
            title: "Complete API Documentation",
            operationsFilter: null
        },
        location: {
            title: "Location API",
            operationsFilter: (tag, operation) => operation.path.includes('/api/Location')
        },
        organization: {
            title: "Organization API",
            operationsFilter: (tag, operation) => operation.path.includes('/api/Organization')
        },
        practitioner: {
            title: "Practitioner API",
            operationsFilter: (tag, operation) => operation.path.includes('/api/Practitioner') && !operation.path.includes('/api/PractitionerRole')
        },
        practitionerrole: {
            title: "Practitioner Role API",
            operationsFilter: (tag, operation) => operation.path.includes('/api/PractitionerRole')
        }
    };
    
    function waitForSwaggerUI() {
        console.log("Waiting for Swagger UI... Attempt:", initializationAttempts + 1);
        
        if (window.ui && document.querySelector('.swagger-ui')) {
            console.log("Swagger UI found! Initializing sidebar...");
            initializeSidebar();
        } else if (initializationAttempts < maxAttempts) {
            initializationAttempts++;
            setTimeout(waitForSwaggerUI, 200);
        } else {
            console.warn("Swagger UI not found after maximum attempts.");
        }
    }
    
    function initializeSidebar() {
        console.log("Initializing sidebar");
        
        // Create sidebar HTML
        const sidebarHTML = `
            <div class="main-container">
                <div class="sidebar">
                    <div class="sidebar-header">
                        <h3 class="sidebar-title">API Controllers</h3>
                    </div>
                    <ul class="nav-menu">
                        <li class="nav-item">
                            <a class="nav-link active" data-controller="all">
                                All APIs
                                <span class="controller-description">Complete API Documentation (Ctrl+1)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-controller="location">
                                Location
                                <span class="controller-description">Location-based services and endpoints (Ctrl+2)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-controller="organization">
                                Organization
                                <span class="controller-description">Organization management APIs (Ctrl+3)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-controller="practitioner">
                                Practitioner
                                <span class="controller-description">Healthcare practitioner information (Ctrl+4)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-controller="practitionerrole">
                                Practitioner Role
                                <span class="controller-description">Practitioner roles and relationships (Ctrl+5)</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="content-area">
                    <div class="custom-nav">
                        <div class="nav-container">
                            <img src="/swagger-ui/dhcsResize.png" alt="Logo" class="nav-logo">
                            <div class="nav-label">California Department of Health Care Services</div>
                        </div>
                    </div>
                    <div class="swagger-container">
                        <div id="original-swagger-ui"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Move existing Swagger UI content
        const existingSwaggerUI = document.querySelector('.swagger-ui');
        if (existingSwaggerUI) {
            console.log("Moving existing Swagger UI content");
            
            // Create new structure
            document.body.innerHTML = sidebarHTML;
            
            // Move the original content
            const newContainer = document.querySelector('#original-swagger-ui');
            newContainer.appendChild(existingSwaggerUI);
            
            // Attach event listeners
            attachEventListeners();
            
            // Initialize with all APIs
            switchController('all');
            
            console.log("Sidebar initialization complete");
        }
    }
    
    function attachEventListeners() {
        console.log("Attaching event listeners");
        
        // Add click event listeners to nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            const controller = link.getAttribute('data-controller');
            console.log("Adding click listener for controller:", controller);
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Nav link clicked for controller:", controller);
                switchController(controller);
            });
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                console.log("Ctrl key pressed with:", e.key);
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        switchController('all');
                        break;
                    case '2':
                        e.preventDefault();
                        switchController('location');
                        break;
                    case '3':
                        e.preventDefault();
                        switchController('organization');
                        break;
                    case '4':
                        e.preventDefault();
                        switchController('practitioner');
                        break;
                    case '5':
                        e.preventDefault();
                        switchController('practitionerrole');
                        break;
                }
            }
        });
    }
    
    function switchController(controller) {
        console.log("switchController called with:", controller);
        
        try {
            // Update active nav item
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const targetLink = document.querySelector(`[data-controller="${controller}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
                console.log("Active class added to:", controller);
            }
            
            // Get controller configuration
            const config = controllerConfig[controller];
            if (!config) {
                console.warn("No configuration found for controller:", controller);
                return;
            }
            
            // Apply filtering
            if (config.operationsFilter) {
                console.log("Applying filter for:", controller);
                setTimeout(() => filterSwaggerOperations(config.operationsFilter), 500);
            } else {
                console.log("Showing all operations");
                setTimeout(() => showAllOperations(), 500);
            }
            
            // Update page title
            document.title = config.title + " - FHIR R4 Provider Directory";
            
            // Update version badge
            setTimeout(() => {
                const versionBadge = document.querySelector('.swagger-ui .info .title .version');
                if (versionBadge) {
                    versionBadge.textContent = "FHIR HL7 R4";
                }
            }, 500);
            
        } catch (error) {
            console.error("Error in switchController:", error);
        }
    }
    
    function showAllOperations() {
        console.log("showAllOperations called");
        
        try {
            const operations = document.querySelectorAll('.swagger-ui .opblock');
            console.log("Found operations:", operations.length);
            
            operations.forEach(operation => {
                operation.style.display = 'block';
            });
            
            const tags = document.querySelectorAll('.swagger-ui .opblock-tag-section');
            console.log("Found tags:", tags.length);
            
            tags.forEach(tag => {
                tag.style.display = 'block';
            });
        } catch (error) {
            console.error("Error in showAllOperations:", error);
        }
    }
    
    function filterSwaggerOperations(filterFunction) {
        console.log("filterSwaggerOperations called");
        
        try {
            const operations = document.querySelectorAll('.swagger-ui .opblock');
            console.log("Filtering operations, found:", operations.length);
            
            let visibleCount = 0;
            
            operations.forEach(operation => {
                const pathElement = operation.querySelector('.opblock-summary-path');
                if (pathElement) {
                    const path = pathElement.textContent.trim();
                    const mockOperation = { path: path };
                    
                    if (filterFunction(null, mockOperation)) {
                        operation.style.display = 'block';
                        visibleCount++;
                    } else {
                        operation.style.display = 'none';
                    }
                }
            });
            
            console.log("Visible operations after filtering:", visibleCount);
            
            // Hide empty tags
            const tags = document.querySelectorAll('.swagger-ui .opblock-tag-section');
            tags.forEach(tag => {
                const visibleOperations = tag.querySelectorAll('.opblock:not([style*="display: none"])');
                if (visibleOperations.length === 0) {
                    tag.style.display = 'none';
                } else {
                    tag.style.display = 'block';
                }
            });
        } catch (error) {
            console.error("Error in filterSwaggerOperations:", error);
        }
    }
    
    // Make functions available globally for testing
    window.switchController = switchController;
    window.testNavigation = function(controller) {
        console.log("Manual test for controller:", controller);
        switchController(controller || 'all');
    };
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForSwaggerUI);
    } else {
        waitForSwaggerUI();
    }
    
})();
