// Sidebar injection script for Swagger UI
(function() {
    'use strict';
    
    console.log('Sidebar injection script loaded');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSidebar);
    } else {
        initializeSidebar();
    }
    
    function initializeSidebar() {
        console.log('Initializing sidebar');
        
        // Wait for Swagger UI to be fully loaded
        let attempts = 0;
        const maxAttempts = 50;
        
        function waitForSwaggerUI() {
            const swaggerContainer = document.querySelector('.swagger-ui');
            if (swaggerContainer && document.querySelector('.information-container')) {
                console.log('Swagger UI found, injecting sidebar');
                injectSidebar();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(waitForSwaggerUI, 100);
            } else {
                console.error('Swagger UI not found after maximum attempts');
            }
        }
        
        waitForSwaggerUI();
    }
    
    function injectSidebar() {
        // Create main container structure
        const body = document.body;
        const swaggerContainer = document.querySelector('.swagger-ui');
        
        if (!swaggerContainer) {
            console.error('Swagger UI container not found');
            return;
        }
        
        // Hide the topbar
        const topbar = document.querySelector('.swagger-ui .topbar');
        if (topbar) {
            topbar.style.display = 'none';
        }
        
        // Create main layout
        const mainContainer = document.createElement('div');
        mainContainer.className = 'custom-main-container';
        mainContainer.innerHTML = `
            <div class="custom-sidebar">
                <div class="sidebar-header">
                    <h3 class="sidebar-title">API Controllers</h3>
                </div>
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a class="nav-link active" data-controller="all" href="javascript:void(0)">
                            All APIs
                            <span class="controller-description">Complete API Documentation (Ctrl+1)</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-controller="location" href="javascript:void(0)">
                            Location
                            <span class="controller-description">Location-based services and endpoints (Ctrl+2)</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-controller="organization" href="javascript:void(0)">
                            Organization
                            <span class="controller-description">Organization management APIs (Ctrl+3)</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-controller="practitioner" href="javascript:void(0)">
                            Practitioner
                            <span class="controller-description">Healthcare practitioner information (Ctrl+4)</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-controller="practitionerrole" href="javascript:void(0)">
                            Practitioner Role
                            <span class="controller-description">Practitioner roles and relationships (Ctrl+5)</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="custom-content-area">
                <div class="custom-nav">
                    <div class="nav-container">
                        <img src="/swagger-ui/dhcsResize.png" alt="Logo" class="nav-logo">
                        <div class="nav-label">California Department of Health Care Services</div>
                    </div>
                </div>
                <div class="swagger-container-wrapper">
                    <!-- Swagger UI will be moved here -->
                </div>
            </div>
        `;
        
        // Insert the main container
        body.insertBefore(mainContainer, body.firstChild);
        
        // Move the existing Swagger UI into our layout
        const swaggerWrapper = mainContainer.querySelector('.swagger-container-wrapper');
        swaggerWrapper.appendChild(swaggerContainer);
        
        // Add event listeners to navigation links
        const navLinks = mainContainer.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const controller = this.getAttribute('data-controller');
                console.log('Nav link clicked:', controller);
                switchController(controller);
            });
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
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
        
        // Initialize with all APIs after a short delay
        setTimeout(() => {
            switchController('all');
        }, 1000);
        
        console.log('Sidebar successfully injected');
    }
    
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
    
    // Global function to switch controllers
    window.switchController = function(controller) {
        console.log("Switching to controller:", controller);
        
        try {
            // Update active nav item
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const targetLink = document.querySelector(`[data-controller="${controller}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
                console.log('Active class added to:', controller);
            } else {
                console.warn('Could not find nav link for controller:', controller);
            }

            // Get controller configuration
            const config = controllerConfig[controller];
            if (!config) {
                console.warn('No configuration found for controller:', controller);
                return;
            }
            
            // Apply filtering
            setTimeout(() => {
                if (config.operationsFilter) {
                    filterSwaggerOperations(config.operationsFilter);
                } else {
                    showAllOperations();
                }
                
                // Update version badge
                const versionBadge = document.querySelector('.swagger-ui .info .title .version');
                if (versionBadge) {
                    versionBadge.textContent = "FHIR HL7 R4";
                }
            }, 500);
            
            // Update page title
            document.title = config.title + " - FHIR R4 Provider Directory";
            console.log('Page title updated to:', document.title);
            
        } catch (error) {
            console.error('Error in switchController:', error);
        }
    };

    function showAllOperations() {
        console.log('Showing all operations');
        
        try {
            const operations = document.querySelectorAll('.swagger-ui .opblock');
            console.log('Found operations:', operations.length);
            
            operations.forEach(operation => {
                operation.style.display = 'block';
            });

            const tags = document.querySelectorAll('.swagger-ui .opblock-tag-section');
            console.log('Found tags:', tags.length);
            
            tags.forEach(tag => {
                tag.style.display = 'block';
            });
        } catch (error) {
            console.error('Error in showAllOperations:', error);
        }
    }

    function filterSwaggerOperations(filterFunction) {
        console.log('Filtering operations');
        
        try {
            const operations = document.querySelectorAll('.swagger-ui .opblock');
            console.log('Filtering operations, found:', operations.length);
            
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
            
            console.log('Visible operations after filtering:', visibleCount);

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
            console.error('Error in filterSwaggerOperations:', error);
        }
    }
    
})();
