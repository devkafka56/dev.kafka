addEventListener("DOMContentLoaded", (event) => {
    // Scrollbar components  
    const scrollContainers = document.querySelectorAll(".scroll-container")
    for (let scrollContainer of scrollContainers) {
        let scrollID = scrollContainer.dataset.scrollGroupId
        const scrollContent = document.querySelector(`[data-scroll-group-id='${scrollID}'].scroll-content`)
        const scrollbarThumb = document.querySelector(`[data-scroll-group-id='${scrollID}'].custom-scrollbar-thumb`)
        const customScrollBarArea = document.querySelector(`[data-scroll-group-id='${scrollID}'].custom-scrollbar`)
  
        const scrollUpButton = document.querySelector(`[data-scroll-group-id='${scrollID}'].scroll-up-button`)
        const scrollDownButton = document.querySelector(`[data-scroll-group-id='${scrollID}'].scroll-down-button`)

        // Constants for scroll step and button height
        const numberOfScrollSteps = 10
        const buttonHeight = scrollUpButton.offsetHeight
        const scrollStep =  scrollContent.scrollHeight / numberOfScrollSteps
        scrollbarThumb.style.top = "0%"
        scrollbarThumb.style.height = '10%'
        scrollbarThumb.style.display = 'block'
        const scrollBarThumbHeightInPercent = (scrollbarThumb.clientHeight / scrollContainer.clientHeight) * 100 // Percentage of the scrollContainer that the thumb takes up.


        // Add click event listeners to scroll buttons
        scrollUpButton.addEventListener("click", () => {
            scrollContent.scrollTop -= scrollStep
        })

        scrollDownButton.addEventListener("click", () => {
            scrollContent.scrollTop += scrollStep
            console.log("Hello. This is the scroll down button!")
        })

        // Update the scrollbar thumb position when scrolling
        scrollContent.addEventListener("scroll", () => {
            console.log(`scrollContainer Height: ${scrollContainer.clientHeight}`)
            console.log(`scrollContent scrollHeight: ${scrollContainer.scrollHeight}`)
            console.log(`scrollContent scrollTop: ${scrollContainer.scrollTop}`)
            
            const scrollPercentage = ((scrollContainer.scrollTop / scrollContainer.scrollHeight)) * 100 // We are scrolled this % of the total scroll content
            const maxTopPercent = 100 - scrollBarThumbHeightInPercent

            console.log(`thumb %: ${scrollBarThumbHeightInPercent}`)
            console.log(`scrollPercentage: ${scrollPercentage}`)
            console.log(`maxTopPercent: ${maxTopPercent}`)

            scrollbarThumb.style.top = `${scrollPercentage}%`

        })

        // Handle scrollbar thumb dragging
        let isDragging = false
        let startY, startThumbPosition

        scrollbarThumb.addEventListener("mousedown", (e) => {
            e.preventDefault()
            isDragging = true
            startY = e.clientY
            startThumbPosition = parseFloat(scrollbarThumb.style.top) || 0
        })

        window.addEventListener("mousemove", (e) => {
            if (isDragging) {
                const deltaY = e.clientY - startY
                const newThumbPosition = startThumbPosition + (deltaY / scrollContainer.clientHeight) * 100

                // Calculate the maximum and minimum positions for the thumb
                const minThumbPosition = 0; // The minimum position is always 0 (top of the scrollbar)
                const maxThumbPosition = 80 - (buttonHeight / scrollContainer.clientHeight) * 80

                const clampedPosition = Math.min(Math.max(newThumbPosition, minThumbPosition), maxThumbPosition)
                scrollbarThumb.style.top = `${clampedPosition}%`;

                const newScrollPosition = (clampedPosition / 100) * (scrollContent.clientHeight - scrollContainer.clientHeight)
                console.log(`Contents are being moved to ${newScrollPosition} from ${scrollContainer.scrollTop}`)
                scrollContainer.scrollTop = newScrollPosition
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


