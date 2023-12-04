addEventListener("DOMContentLoaded", (event) => {
    // Scrollbar components  
    const scrollContainers = document.querySelectorAll(".scroll-container")
    for (let scrollContainer of scrollContainers) {
        let scrollID = scrollContainer.dataset.scrollGroupId
        const scrollContent = document.querySelector(`[data-scroll-group-id='${scrollID}'].scroll-content`)
        const scrollbarThumb = document.querySelector(`[data-scroll-group-id='${scrollID}'].custom-scrollbar-thumb`)
        const customScrollBar = document.querySelector(`[data-scroll-group-id='${scrollID}'].custom-scrollbar`)
        const scrollUpButton = document.querySelector(`[data-scroll-group-id='${scrollID}'].scroll-up-button`)
        const scrollDownButton = document.querySelector(`[data-scroll-group-id='${scrollID}'].scroll-down-button`)

        // Constants for scroll step and button height
        const buttonHeight = scrollUpButton.offsetHeight 
        const scrollContainerHeight = scrollContainer.offsetHeight
        const hiddenContentHeight = scrollContainer.scrollHeight - scrollContainerHeight
        const percentHidden = (hiddenContentHeight / scrollContainer.scrollHeight)
        const thumbPercentage = 1 - percentHidden
        customScrollBar.setAttribute("style", `height:${scrollContainerHeight - 1 - (2 * buttonHeight)}px;`)
        const thumbHeight = thumbPercentage * customScrollBar.offsetHeight
        scrollbarThumb.setAttribute("style", `height:${thumbHeight}px;`)
        scrollUpButton.setAttribute("style", `top:-${buttonHeight}px;`)
        scrollDownButton.setAttribute("style", `bottom:-${buttonHeight}px;`)

        const numberOfScrollSteps = 10
        const scrollStep = scrollContent.scrollHeight / numberOfScrollSteps

        scrollbarThumb.style.top = "0%"

        // Add click event listeners to scroll buttons
        scrollUpButton.addEventListener("click", () => {
            scrollContainer.scrollTop -= scrollStep
        })
        scrollDownButton.addEventListener("click", () => {
            scrollContainer.scrollTop += scrollStep
        })

        // Handle scrollbar thumb dragging
        let isDragging = false
        let startY, startThumbPosition

        // Update the scrollbar thumb position when scrolling
        scrollContainer.addEventListener("scroll", () => {
            const percentScrolled = (scrollContainer.scrollTop / scrollContainer.scrollHeight)
            const thumbTop = percentScrolled * customScrollBar.offsetHeight
            if (!isDragging) {
            scrollbarThumb.style.top = `${thumbTop}px`}
        })



        scrollbarThumb.addEventListener("mousedown", (e) => {
            e.preventDefault()
            isDragging = true
            startY = e.clientY
            startThumbPosition = scrollbarThumb.offsetTop
        })

        window.addEventListener("mousemove", (e) => {
            if (isDragging) {
                const deltaY = e.clientY - startY
                let newThumbTop = startThumbPosition + deltaY
                const maxThumbTop = scrollContainer.clientHeight - (scrollbarThumb.clientHeight + (buttonHeight*2))
                if (newThumbTop < 0) { newThumbTop = 0 }
                if (newThumbTop > maxThumbTop) {newThumbTop = maxThumbTop}
                const percentDragged = newThumbTop / (maxThumbTop)
                const newScrollTop = percentDragged * hiddenContentHeight
                scrollContainer.scrollTop = newScrollTop
                scrollbarThumb.style.top = `${newThumbTop}px`



            }

        })

        window.addEventListener("mouseup", () => {
            isDragging = false
        })

        // for scrolling with trackpad/mouse 
        scrollContainer.addEventListener("wheel", (e) => {
            e.preventDefault() // Prevent the default scrolling behavior
            const deltaY = e.deltaY
            const currentScroll = scrollContainer.scrollTop
            const newScrollPosition = currentScroll + deltaY

            // Ensure the new scroll position stays within bounds
            const maxScroll = scrollContent.clientHeight - scrollContainer.clientHeight
            const clampedScroll = Math.min(Math.max(newScrollPosition, 0), maxScroll)

            // Update the scroll position
            scrollContainer.scrollTop = clampedScroll
        })


    }

})


